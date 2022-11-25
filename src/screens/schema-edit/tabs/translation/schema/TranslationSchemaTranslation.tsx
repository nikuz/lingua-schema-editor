import React from 'react';
import { Stack } from '@mui/material';
import { TranslationSchemaType } from 'src/types';
import { SchemaItem } from 'src/components';

interface Props {
    data: any,
    schema?: TranslationSchemaType,
}

/// Component for rendering main translation entities
/// Such as:
/// * word (original word)
/// * auto spelling fix
/// * translation
/// * transcription
export default function TranslationSchemaTranslation(props: Props) {
    const { data, schema } = props;

    return (
        <Stack spacing={1}>
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
                title="Translation"
                data={data}
                schema={schema}
                schemaPath="translation.value"
            />
            <SchemaItem
                title="Transcription"
                data={data}
                schema={schema}
                schemaPath="transcription.value"
            />
        </Stack>
    );
}