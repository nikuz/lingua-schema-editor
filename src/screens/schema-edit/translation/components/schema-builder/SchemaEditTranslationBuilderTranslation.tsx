import React from 'react';
import {
    Stack,
    Typography,
    ListItem,
} from '@mui/material';
import { TranslationSchemaType } from 'src/types';
import { SchemaItem, SchemaItemRenderType } from 'src/components';

interface Props {
    data: any,
    schema?: TranslationSchemaType,
}

export default function SchemaEditTranslationBuilderTranslation(props: Props) {
    const { data, schema } = props;

    return (
        <Stack spacing={1}>
            <Typography variant="h6" sx={{ mt: 2 }}>Translation</Typography>
            <SchemaItem
                title="Gender"
                renderType={SchemaItemRenderType.list}
                data={data}
                schema={schema}
                schemaPath="translation.value"
                itemRender={(item) => (
                    <TranslationSchemaTranslationGender
                        data={item}
                        schema={schema}
                    />
                )}
            />
        </Stack>
    );
}

function TranslationSchemaTranslationGender(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaItem
                    title="Gender"
                    data={data}
                    schema={schema}
                    schemaPath="translation.gender.value"
                />
                <SchemaItem
                    title="Word"
                    data={data}
                    schema={schema}
                    schemaPath="translation.word.value"
                />
                <SchemaItem
                    title="Sentences"
                    renderType={SchemaItemRenderType.list}
                    data={data}
                    schema={schema}
                    schemaPath="translation.sentence.value"
                    itemRender={(item) => (
                        <TranslationSchemaTranslationGenderSentences
                            data={item}
                            schema={schema}
                        />
                    )}
                />
            </Stack>
        </ListItem>
    );
}

function TranslationSchemaTranslationGenderSentences(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaItem
                    title="Word"
                    data={data}
                    schema={schema}
                    schemaPath="translation.sentence.word.value"
                />
            </Stack>
        </ListItem>
    );
}