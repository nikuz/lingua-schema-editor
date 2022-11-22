import React from 'react';
import jmespath from 'jmespath';
import {
    Stack,
    Typography,
} from '@mui/material';
import { TranslationSchemaAlternativeTranslations } from '../../types';
import SchemaRendererItem, { SchemaRendererItemType } from './SchemaRendererItem';

interface Props {
    data: any,
    schema?: TranslationSchemaAlternativeTranslations,
}

export default function SchemaRendererAlternativeTranslations(props: Props) {
    const { data, schema } = props;
    const speechPart = schema?.speech_part
        ? jmespath.search(data, schema.speech_part.value)
        : undefined;
    const items = schema?.items
        ? jmespath.search(data, schema.items.value)
        : undefined;

    return <>
        <Typography variant="h6" sx={{ mt: 2 }}>Alternative translations</Typography>
        <Stack spacing={1}>
            <SchemaRendererItem title="Speech part" value={speechPart} />
            <SchemaRendererItem
                title="Items"
                value={items}
                type={SchemaRendererItemType.list}
                itemRender={(item) => (
                    <SchemaRendererAlternativeTranslationsItem
                        data={item}
                        schema={schema}
                    />
                )}
            />
        </Stack>
    </>;
}

function SchemaRendererAlternativeTranslationsItem(props: Props) {
    const { data, schema } = props;
    const translation = schema?.items?.translation
        ? jmespath.search(data, schema.items.translation.value)
        : undefined;
    const words = schema?.items?.words
        ? jmespath.search(data, schema.items.words.value)
        : undefined;
    const frequency = schema?.items?.frequency
        ? jmespath.search(data, schema.items.frequency.value)
        : undefined;

    return (
        <Stack spacing={1}>
            <SchemaRendererItem title="Translation" value={translation} />
            <SchemaRendererItem title="Words" value={words} />
            <SchemaRendererItem title="Frequency" value={frequency} />
        </Stack>
    );
}