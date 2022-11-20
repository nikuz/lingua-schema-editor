import React from 'react';
import { FormTree } from '../../../components';
import { SchemaRenderSelectedItem } from '../../../types';
import schema from './schema';

interface Props {
    selectedField?: SchemaRenderSelectedItem,
    onFieldFocus: (field: SchemaRenderSelectedItem) => void,
}

export default function Definitions(props: Props) {
    return (
        <div className="form-row">
            <FormTree
                fields={schema}
                indent={0}
                dividerText="Definitions"
                selectedField={props.selectedField}
                onFieldFocus={props.onFieldFocus}
            />
        </div>
    );
}
