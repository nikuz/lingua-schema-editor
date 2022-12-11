import React from 'react';
import { Typography } from '@mui/material';
import { TranslationSchemaContext } from 'src/helpers';
import { TranslationSchemaType } from 'src/types';
import { SchemaItem } from 'src/components';
import SchemaEditTranslationBuilderTranslation from './SchemaEditTranslationBuilderTranslation';
import SchemaEditTranslationBuilderAlternativeTranslations from './SchemaEditTranslationBuilderAlternativeTranslations';
import SchemaEditTranslationBuilderDefinitions from './SchemaEditTranslationBuilderDefinitions';
import SchemaEditTranslationBuilderExamples from './SchemaEditTranslationBuilderExamples';

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
            <Typography
                variant="h4"
                sx={{ mt: 3 }}
                gutterBottom
            >
                Translation Schema
            </Typography>
            <SchemaItem
                title="Word"
                data={data}
                schema={schema}
                schemaPath="word.value"
            />
            <SchemaItem
                title="Auto spelling fix"
                data={data}
                schema={schema}
                schemaPath="auto_spelling_fix.value"
            />
            <SchemaItem
                title="Transcription"
                data={data}
                schema={schema}
                schemaPath="transcription.value"
            />
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
        </TranslationSchemaContext.Provider>
    );
}
