import React from 'react';
import { Typography } from '@mui/material';
import { Collapsable } from 'src/components';
import { TranslationSchemaContext } from 'src/helpers';
import { TranslationSchemaType } from 'src/types';
import SchemaEditTranslationBuilderTranslation from './SchemaEditTranslationBuilderTranslation';
import SchemaEditTranslationBuilderAlternativeTranslations from './SchemaEditTranslationBuilderAlternativeTranslations';
import SchemaEditTranslationBuilderDefinitions from './SchemaEditTranslationBuilderDefinitions';
import SchemaEditTranslationBuilderExamples from './SchemaEditTranslationBuilderExamples';
import './SchemaEditTranslationBuilder.css';

interface Props {
    data: any,
    schema: TranslationSchemaType,
    onDataPathSelect: (schemaPath: string, dataPath: string) => void,
}

export default function SchemaEditTranslationBuilder(props: Props) {
    const {
        data,
        schema,
        onDataPathSelect,
    } = props;

    return (
        <TranslationSchemaContext.Provider value={{ onDataPathSelect }}>
            <div className="translation-schema-container">
                <Typography
                    variant="h4"
                    sx={{ mt: 3 }}
                    gutterBottom
                >
                    Translation Schema
                </Typography>
                <SchemaEditTranslationBuilderTranslation
                    data={data}
                    schema={schema}
                />
                <SchemaEditTranslationBuilderAlternativeTranslations
                    data={data}
                    schema={schema}
                />
                <SchemaEditTranslationBuilderDefinitions
                    data={data}
                    schema={schema}
                />
                <SchemaEditTranslationBuilderExamples
                    data={data}
                    schema={schema}
                />
                <Collapsable title="Schema" headerSize="h5" marginTop={5}>
                    <pre>
                        {JSON.stringify(schema, null, 4)}
                    </pre>
                </Collapsable>
            </div>
        </TranslationSchemaContext.Provider>
    );
}
