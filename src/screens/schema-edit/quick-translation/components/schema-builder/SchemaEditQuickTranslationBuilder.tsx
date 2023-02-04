import React from 'react';
import {
    ListItem,
    Stack,
    Typography,
} from '@mui/material';
import { TranslationSchemaContext } from 'src/helpers';
import { QuickTranslationSchemaType } from 'src/types';
import { SchemaItem, SchemaItemRenderType } from 'src/components';

interface Props {
    data: any,
    schema: QuickTranslationSchemaType,
    onDataPathSelect: (schemaPath: string, dataPath: string) => void,
}

export default function SchemaEditQuickTranslationBuilder(props: Props) {
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
                title="Sentences"
                renderType={SchemaItemRenderType.list}
                data={data}
                schema={schema}
                schemaPath="sentences.value"
                itemRender={(item) => (
                    <TranslationSchemaQuickTranslationSentences
                        data={item}
                        schema={schema}
                    />
                )}
            />
        </TranslationSchemaContext.Provider>
    );
}

interface SentencesProps {
    data: any,
    schema?: QuickTranslationSchemaType,
}

function TranslationSchemaQuickTranslationSentences(props: SentencesProps) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaItem
                    title="Original Word"
                    data={data}
                    schema={schema}
                    schemaPath="sentences.original_word.value"
                />
                <SchemaItem
                    title="Translation"
                    data={data}
                    schema={schema}
                    schemaPath="sentences.translation.value"
                />
            </Stack>
        </ListItem>
    );
}