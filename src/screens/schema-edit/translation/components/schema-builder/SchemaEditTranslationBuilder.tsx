import { Typography } from '@mui/material';
import { TranslationSchemaContext } from 'src/helpers';
import { TranslationSchemaType } from 'src/types';
import { SchemaItem } from 'src/components';
import SchemaEditTranslationBuilderTranslations from './SchemaEditTranslationBuilderTranslations';
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

    if (!data) {
        return null;
    }

    return (
        <TranslationSchemaContext.Provider value={{ onDataPathSelect }}>
            <Typography
                variant="h4"
                sx={{ mt: 3 }}
                gutterBottom
            >
                Schema Builder
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
                title="Auto language code"
                data={data}
                schema={schema}
                schemaPath="auto_language_code.value"
            />
            <SchemaItem
                title="Transcription"
                data={data}
                schema={schema}
                schemaPath="transcription.value"
            />
            <SchemaEditTranslationBuilderTranslations
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
