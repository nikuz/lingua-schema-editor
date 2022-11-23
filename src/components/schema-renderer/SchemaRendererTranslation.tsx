import React from 'react';
import { Stack } from '@mui/material';
import { TranslationSchema } from '../../types';
import SchemaRendererItem from './SchemaRendererItem';

interface Props {
    data: any,
    schema?: TranslationSchema,
}

/// Component for rendering main translation entities
/// Such as:
/// * word (original word)
/// * auto spelling fix
/// * translation
/// * transcription
export default function SchemaRendererTranslation(props: Props) {
    const { data, schema } = props;

    return (
        <Stack spacing={1}>
            <SchemaRendererItem
                title="Word"
                data={data}
                schema={schema}
                schemaPath="word.value"
            />
            <SchemaRendererItem
                title="Auto spelling fix"
                data={data}
                schema={schema}
                schemaPath="word.auto_spelling_fix.value"
            />
            <SchemaRendererItem
                title="Translation"
                data={data}
                schema={schema}
                schemaPath="word.translation.value"
            />
            <SchemaRendererItem
                title="Transcription"
                data={data}
                schema={schema}
                schemaPath="word.transcription.value"
            />
        </Stack>
    );
}