import React from 'react';
import { TranslationSchema } from '../../types';
import SchemaRendererDefinitions from './SchemaRendererDefinitions';

interface Props {
    data: JSON,
    schema: TranslationSchema,
}

export default function SchemaRenderer(props: Props) {
    return (
        <div className="schema-renderer">
            <SchemaRendererDefinitions
                data={props.data}
                definitions={props.schema.definitions}
            />
        </div>
    );
}
