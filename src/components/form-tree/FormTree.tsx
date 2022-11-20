import React from 'react';
import {
    List,
    Divider,
    Chip,
} from '@mui/material';
import {
    FieldsItem,
    FieldsSelectedItem,
} from '../../types';
import FormTreeItem from './FormTreeItem';

interface Props {
    fields: FieldsItem[],
    indent: number,
    path?: string,
    dividerText?: string,
    selectedField?: FieldsSelectedItem,
    onFieldFocus: (field: FieldsSelectedItem) => void,
}

export default function FormTree(props: Props) {
    return <>
        {props.dividerText && (
            <Divider textAlign="left" sx={{ pb: 1 }}>
                <Chip label={props.dividerText} />
            </Divider>
        )}
        {props.fields.map((item) => {
            const path = props.path ? `${props.path}.${item.id}` : item.id;

            return <React.Fragment key={item.id}>
                <List component="div" disablePadding>
                    <FormTreeItem
                        id={item.id}
                        label={item.label}
                        description={item.description}
                        path={path}
                        indent={props.indent}
                        selectedField={props.selectedField}
                        onFieldFocus={props.onFieldFocus}
                    />
                </List>
                {item.fields && (
                    <FormTree
                        fields={item.fields}
                        indent={props.indent + 3}
                        path={path}
                        selectedField={props.selectedField}
                        onFieldFocus={props.onFieldFocus}
                    />
                )}
            </React.Fragment>;
        })}
    </>;
}
