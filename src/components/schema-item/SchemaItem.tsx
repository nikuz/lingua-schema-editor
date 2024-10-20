import React, { useState, useMemo, useCallback, useContext } from 'react';
import jmespath from 'jmespath';
import {
    Alert,
    Box,
    Divider,
    List,
    Typography,
    Link,
    Modal,
    TextField,
    Button,
} from '@mui/material';
import { TranslationSchemaContext } from 'src/helpers';
import { SchemaItemRenderType } from 'src/types';
import Collapsable from '../collapsable';
import JsonEditor from '../json-editor';
import './SchemaItem.css';

interface Props {
    title: string,
    renderType?: SchemaItemRenderType,
    data: any,
    schema: any,
    schemaPath: string,
    itemRender?: (item: any) => React.ReactElement,
}

export default function SchemaItem({
    title,
    renderType = SchemaItemRenderType.string,
    data,
    schema,
    schemaPath,
    itemRender,
}: Props) {
    const [pathSelectorIsOpen, setPathSelectorIsOpen] = useState(false);
    const context = useContext(TranslationSchemaContext);
    const isListExpected = renderType === SchemaItemRenderType.list;
    const dataPath = useMemo(() => (
        jmespath.search(schema, schemaPath)
    ), [schema, schemaPath]);
    const value = useMemo(() => (
        dataPath && typeof dataPath === 'string' ? jmespath.search(data, dataPath) : undefined
    ), [data, dataPath]);
    const [manualEnterValue, setManualEnterValue] = useState(dataPath || '');
    let content;
    
    const openPathModalHandler = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setPathSelectorIsOpen(true);
    }, []);

    const closePathModalHandler = useCallback(() => {
        setPathSelectorIsOpen(false);
    }, []);

    const selectHandler = useCallback((dataPath: string) => {
        if (context.onDataPathSelect) {
            context.onDataPathSelect(schemaPath, dataPath);
        }
        setManualEnterValue(dataPath);
        closePathModalHandler();
    }, [context, schemaPath, closePathModalHandler]);

    if (value !== undefined) {
        if (isListExpected) {
            // if the data for current field is not present in the translation response
            // then just show schema fields for manual filling
            let data = value;
            if (!Array.isArray(value)) {
                data = [];
            }
            content = <>
                <Typography variant="subtitle1">
                    <Link href="#" onClick={openPathModalHandler}>
                        {title}
                    </Link>
                </Typography>
                {/*show only first item to prevent UI pollution*/}
                <List>
                    {itemRender ? itemRender(data[0]) : null}
                </List>

                {/*render the rest items under a folded Accordion*/}
                {data.length > 1 && (
                    <Collapsable title={`Other ${title}`} marginTop={2}>
                        <List>
                            {data.map((item: any, key: number) => {
                                if (key === 0) {
                                    return null;
                                }
                                return (
                                    <React.Fragment key={key}>
                                        {itemRender ? itemRender(item) : null}
                                        {key !== data.length - 1 && <Divider />}
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    </Collapsable>
                )}
            </>;
        } else {
            content = (
                <Alert>
                    <Link href="#" onClick={openPathModalHandler}>{title}</Link>
                    :&nbsp;
                    {String(value)}
                </Alert>
            );
        }
    } else {
        content = (
            <Box sx={{ position: 'relative' }}>
                <Alert severity="error">
                    {title} {isListExpected ? 'are' : 'is'} not set {isListExpected ? 'or not a list' : ''}
                </Alert>
                <div className="blocker pointer" onClick={openPathModalHandler} />
            </Box>
        );
    }

    return <>
        {content}
        {pathSelectorIsOpen && (
            <Modal
                open
                onClose={closePathModalHandler}
            >
                <div className="json-editor-modal-container flex flex-center relative">
                    <div className="blocker" onClick={closePathModalHandler} />
                    <div className="json-editor-modal-wrapper">
                        <div className="json-editor-modal-title">
                            <Typography variant="body1" sx={{ mr: 5 }}>
                                {schemaPath}
                            </Typography>
                            <TextField
                                variant="outlined"
                                label="Manual enter"
                                size="small"
                                value={manualEnterValue}
                                onChange={(event) => {
                                    setManualEnterValue(event.target.value);
                                }}
                            />
                            <Button
                                sx={{ ml: 1 }}
                                onClick={() => selectHandler(manualEnterValue)}
                            >
                                Save manual
                            </Button>
                        </div>
                        <div className="json-editor-modal-body">
                            <JsonEditor
                                mode="tree"
                                data={data}
                                onSelect={selectHandler}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        )}
    </>;
}