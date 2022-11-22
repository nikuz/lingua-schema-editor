import React from 'react';
import jmespath from 'jmespath';
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
    const word = schema?.word
        ? jmespath.search(data, schema.word.value)
        : undefined;
    const autoSpellingFix = schema?.auto_spelling_fix
        ? jmespath.search(data, schema.auto_spelling_fix.value)
        : undefined;
    const translation = schema?.translation
        ? jmespath.search(data, schema.translation.value)
        : undefined;
    const transcription = schema?.transcription
        ? jmespath.search(data, schema.transcription.value)
        : undefined;

    return (
        <Stack spacing={1}>
            <SchemaRendererItem title="Word" value={word} />
            <SchemaRendererItem title="Auto spelling fix" value={autoSpellingFix} />
            <SchemaRendererItem title="Translation" value={translation} />
            <SchemaRendererItem title="Transcription" value={transcription} />
        </Stack>
    );
}