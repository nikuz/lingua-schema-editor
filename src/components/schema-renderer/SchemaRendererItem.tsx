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
    Chip,
} from '@mui/material';
import Collapsable from '../collapsable';
import JsonEditor from '../json-editor';
import SchemaRendererContext from './SchemaRendererContext';

export enum SchemaRendererItemType {
    string,
    list,
}

interface Props {
    title: string,
    type?: SchemaRendererItemType,
    data: any,
    schema: any,
    schemaPath: string,
    itemRender?: (item: any) => React.ReactElement,
}

export default function SchemaRendererItem({
    title,
    type = SchemaRendererItemType.string,
    data,
    schema,
    schemaPath,
    itemRender,
}: Props) {
    const [pathSelectorIsOpen, setPathSelectorIsOpen] = useState(false);
    const context = useContext(SchemaRendererContext);
    const isListExpected = type === SchemaRendererItemType.list;
    const dataPath = useMemo(() => (
        jmespath.search(schema, schemaPath)
    ), [schema, schemaPath]);
    const value = useMemo(() => (
        dataPath && typeof dataPath === 'string' ? jmespath.search(data, dataPath) : undefined
    ), [data, dataPath]);
    let content;
    
    const openPathModalHandler = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setPathSelectorIsOpen(true);
    }, []);

    const closePathModalHandler = useCallback(() => {
        setPathSelectorIsOpen(false);
    }, []);

    if (value !== undefined) {
        if (isListExpected && Array.isArray(value)) {
            content = <>
                <Typography variant="subtitle1">
                    <Link href="#" onClick={openPathModalHandler}>
                        {title}
                    </Link>
                </Typography>
                {/*show only first item to prevent UI pollution*/}
                {itemRender ? itemRender(value[0]) : null}

                {/*render the rest items under a folded Accordion*/}
                {value.length > 1 && (
                    <Collapsable title={`Other ${title}`} marginTop={2}>
                        <List>
                            {value.map((item: any, key) => {
                                if (key === 0) {
                                    return null;
                                }
                                return (
                                    <React.Fragment key={key}>
                                        {itemRender ? itemRender(item) : null}
                                        {key !== value.length - 1 && <Divider />}
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
                            <Chip label={schemaPath} color="primary" />
                        </div>
                        <JsonEditor
                            mode="tree"
                            data={data}
                            onSelect={(dataPath: string) => {
                                console.log(schemaPath);
                                console.log(dataPath);
                                if (context.onDataPathSelect) {
                                    context.onDataPathSelect(schemaPath, dataPath);
                                }
                                closePathModalHandler();
                            }}
                        />
                    </div>
                </div>
            </Modal>
        )}
    </>
}