import React from 'react';
import {
    ListItem,
    Stack,
    Typography,
} from '@mui/material';
import { TranslationSchemaType } from 'src/types';
import { SchemaItem, SchemaItemRenderType } from 'src/components';

interface Props {
    data: any,
    schema?: TranslationSchemaType,
}

export default function SchemaEditTranslationBuilderAlternativeTranslations(props: Props) {
    const { data, schema } = props;

    return <>
        <Typography variant="h6" sx={{ mt: 2 }}>Alternative translations</Typography>
        <SchemaItem
            title="Speech parts"
            renderType={SchemaItemRenderType.list}
            data={data}
            schema={schema}
            schemaPath="alternative_translations.value"
            itemRender={(item) => (
                <TranslationSchemaAlternativeTranslationsSpeechPart
                    data={item}
                    schema={schema}
                />
            )}
        />
    </>;
}

function TranslationSchemaAlternativeTranslationsSpeechPart(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaItem
                    title="Speech part"
                    data={data}
                    schema={schema}
                    schemaPath="alternative_translations.speech_part.value"
                />
                <SchemaItem
                    title="Items"
                    renderType={SchemaItemRenderType.list}
                    data={data}
                    schema={schema}
                    schemaPath="alternative_translations.items.value"
                    itemRender={(item) => (
                        <TranslationSchemaAlternativeTranslationsItem
                            data={item}
                            schema={schema}
                        />
                    )}
                />
            </Stack>
        </ListItem>
    );
}

function TranslationSchemaAlternativeTranslationsItem(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaItem
                    title="Genre"
                    data={data}
                    schema={schema}
                    schemaPath="alternative_translations.items.genre.value"
                />
                <SchemaItem
                    title="Translation"
                    data={data}
                    schema={schema}
                    schemaPath="alternative_translations.items.translation.value"
                />
                <SchemaItem
                    title="Frequency"
                    data={data}
                    schema={schema}
                    schemaPath="alternative_translations.items.frequency.value"
                />
                <SchemaItem
                    title="Words"
                    data={data}
                    schema={schema}
                    schemaPath="alternative_translations.items.words.value"
                />
            </Stack>
        </ListItem>
    );
}