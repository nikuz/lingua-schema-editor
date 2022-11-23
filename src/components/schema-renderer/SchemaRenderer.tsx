import React from 'react';
import { Typography } from '@mui/material';
import Collapsable from '../collapsable';
import { TranslationSchema } from '../../types';
import SchemaRendererTranslation from './SchemaRendererTranslation';
import SchemaRendererAlternativeTranslations from './SchemaRendererAlternativeTranslations';
import SchemaRendererDefinitions from './SchemaRendererDefinitions';
import SchemaRendererExamples from './SchemaRendererExamples';
import SchemaRendererContext from './SchemaRendererContext';
import './SchemaRenderer.css';

interface Props {
    data: any,
    schema: TranslationSchema,
    onDataPathSelect: (schemaPath: string, dataPath: string) => void,
}

export default function SchemaRenderer(props: Props) {
    const {
        data,
        schema,
        onDataPathSelect,
    } = props;

    return (
        <SchemaRendererContext.Provider value={{ onDataPathSelect }}>
            <div className="schema-renderer">
                <Typography
                    variant="h4"
                    sx={{ mt: 3 }}
                    gutterBottom
                >
                    Preview
                </Typography>
                <SchemaRendererTranslation
                    data={data}
                    schema={schema}
                />
                <SchemaRendererAlternativeTranslations
                    data={data}
                    schema={schema}
                />
                <SchemaRendererDefinitions
                    data={data}
                    schema={schema}
                />
                <SchemaRendererExamples
                    data={data}
                    schema={schema}
                />
                <Collapsable title="Schema" headerSize="h5" marginTop={5}>
                    <pre>
                        {JSON.stringify(schema, null, 4)}
                    </pre>
                </Collapsable>
            </div>
        </SchemaRendererContext.Provider>
    );
}
