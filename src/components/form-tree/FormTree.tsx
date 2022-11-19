import React from 'react';
import {
    TextField,
    List,
    ListItem,
    Divider,
    Chip,
} from '@mui/material';
import { SchemaRenderItem } from '../../types';

interface Props {
    fields: SchemaRenderItem[],
    intent: number,
    dividerText?: string,
}

export default function FormTree(props: Props) {
    return <>
        {props.dividerText && (
            <Divider textAlign="left" sx={{ pb: 1 }}>
                <Chip label={props.dividerText} />
            </Divider>
        )}
        {props.fields.map((item) => (
            <List key={item.id} component="div" disablePadding>
                <ListItem sx={{ pl: props.intent }}>
                    <TextField
                        variant="outlined"
                        id={item.id}
                        label={item.label}
                        size="small"
                        helperText={item.description}
                        value={item.value}
                    />
                </ListItem>
                {item.fields && (
                    <FormTree
                        fields={item.fields}
                        intent={props.intent + 3}
                    />
                )}
            </List>
        ))}
    </>;
}
