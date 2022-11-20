import React, { useState, useEffect } from 'react';
import {
    TextField,
    ListItem,
} from '@mui/material';
import { FieldsSelectedItem } from '../../types';

interface Props {
    id: string,
    label: string,
    description?: string,
    path: string,
    selectedField?: FieldsSelectedItem,
    indent: number,
    onFieldFocus: (field: FieldsSelectedItem) => void,
}

export default function FormTreeItem(props: Props) {
    const { path, selectedField } = props;
    const [value, setValue] = useState('');
    const isActive = props.selectedField?.path === path;

    useEffect(() => {
        if (
            selectedField
            && selectedField.path === path
            && selectedField.value !== value
        ) {
            setValue(selectedField.value || '');
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
