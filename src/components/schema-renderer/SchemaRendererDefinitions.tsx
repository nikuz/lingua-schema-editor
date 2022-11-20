import React from 'react';
import { TranslationSchemaDefinitions } from '../../types';

interface Props {
    data: JSON,
    definitions?: TranslationSchemaDefinitions,
}

export default function SchemaRendererDefinitions(props: Props) {
    const definitions = props.definitions;
    if (!definitions) {
        return null;
    }

    return (
        <div className="schema-renderer">

        </div>
    );
}
