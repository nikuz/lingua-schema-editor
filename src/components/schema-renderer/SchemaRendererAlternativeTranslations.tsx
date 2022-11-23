import React from 'react';
import {
    ListItem,
    Stack,
    Typography,
} from '@mui/material';
import { TranslationSchema } from '../../types';
import SchemaRendererItem, { SchemaRendererItemType } from './SchemaRendererItem';

interface Props {
    data: any,
    schema?: TranslationSchema,
}

export default function SchemaRendererAlternativeTranslations(props: Props) {
    const { data, schema } = props;

    return <>
        <Typography variant="h6" sx={{ mt: 2 }}>Alternative translations</Typography>
        <SchemaRendererItem
            title="Speech parts"
            type={SchemaRendererItemType.list}
            data={data}
            schema={schema}
            schemaPath="alternative_translations.value"
            itemRender={(item) => (
                <SchemaRendererAlternativeTranslationsSpeechPart
                    data={item}
                    schema={schema}
                />
            )}
        />
    </>;
}

function SchemaRendererAlternativeTranslationsSpeechPart(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaRendererItem
                    title="Speech part"
                    data={data}
                    schema={schema}
                    schemaPath="alternative_translations.speech_part.value"
                />
                <SchemaRendererItem
                    title="Items"
                    type={SchemaRendererItemType.list}
                    data={data}
                    schema={schema}
                    schemaPath="alternative_translations.items.value"
                    itemRender={(item) => (
                        <SchemaRendererAlternativeTranslationsItem
                            data={item}
                            schema={schema}
                        />
                    )}
                />
            </Stack>
        </ListItem>
    );
}

function SchemaRendererAlternativeTranslationsItem(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaRendererItem
                    title="Translation"
                    data={data}
                    schema={schema}
                    schemaPath="alternative_translations.items.translation.value"
                />
                <SchemaRendererItem
                    title="Frequency"
                    data={data}
                    schema={schema}
                    schemaPath="alternative_translations.items.frequency.value"
                />
                <SchemaRendererItem
                    title="Words"
                    data={data}
                    schema={schema}
                    schemaPath="alternative_translations.items.words.value"
                />
            </Stack>
        </ListItem>
    );
}