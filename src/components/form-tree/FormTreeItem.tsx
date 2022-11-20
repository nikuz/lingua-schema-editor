import React, { useState, useEffect } from 'react';
import {
    TextField,
    ListItem,
} from '@mui/material';
import { SchemaRenderSelectedItem } from '../../types';

interface Props {
    id: string,
    label: string,
    description?: string,
    path: string,
    selectedField?: SchemaRenderSelectedItem,
    indent: number,
    onFieldFocus: (field: SchemaRenderSelectedItem) => void,
}

export default function FormTreeItem(props: Props) {
    const { path, selectedField } = props;
    const [value, setValue] = useState('');
    const isActive = props.selectedField?.path === path;

    useEffect(() => {
        if (
            selectedField
            && selectedField.path === path
            && selectedField.value
            && selectedField.value.toString() !== value
        ) {
            setValue(selectedField.value.toString());
        }
    }, [value, path, selectedField]);

    return (
        <ListItem sx={{ pl: props.indent,  }}>
            <TextField
                variant="outlined"
                id={props.id}
                label={props.label}
                size="small"
                helperText={props.description}
                value={value}
                color={isActive ? 'secondary' : undefined}
                focused={isActive}
                InputProps={{
                    readOnly: true,
                }}
                onFocus={() => {
                    props.onFieldFocus({ path });
                }}
            />
        </ListItem>
    );
}
