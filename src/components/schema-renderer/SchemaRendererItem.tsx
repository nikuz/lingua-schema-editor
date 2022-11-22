import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert, Divider,
    List,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export enum SchemaRendererItemType {
    string,
    list,
}

interface Props {
    title: string,
    value?: any,
    type?: SchemaRendererItemType,
    itemRender?: (item: any) => React.ReactElement,
}

export default function SchemaRendererItem({
   title,
   value,
   type = SchemaRendererItemType.string,
   itemRender,
}: Props) {
    const isListExpected = type === SchemaRendererItemType.list;

    if (value !== undefined) {
        if (isListExpected && Array.isArray(value)) {
            return <>
                <Typography variant="subtitle1">{title}</Typography>
                {itemRender ? itemRender(value[0]) : null}
                {value.length > 1 && (
                    <Accordion disableGutters sx={{ mt: 2 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography>Other {title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
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
                        </AccordionDetails>
                    </Accordion>
                )}
            </>;
        }

        return <Alert>{title}: {String(value)}</Alert>;
    }

    return (
        <Alert severity="error">
            {title} {isListExpected ? 'are' : 'is'} not set {isListExpected ? 'or not a list' : ''}
        </Alert>
    );
}