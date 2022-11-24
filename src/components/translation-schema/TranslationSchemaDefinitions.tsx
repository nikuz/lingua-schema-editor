import React from 'react';
import {
    ListItem,
    Stack,
    Typography,
} from '@mui/material';
import { TranslationSchemaType } from '../../types';
import SchemaItem, { SchemaItemRenderType } from '../schema-item';

interface Props {
    data: any,
    schema?: TranslationSchemaType,
}

export default function TranslationSchemaDefinitions(props: Props) {
    const { data, schema } = props;

    return <>
        <Typography variant="h6" sx={{ mt: 2 }}>Definitions</Typography>
        <SchemaItem
            title="Speech parts"
            renderType={SchemaItemRenderType.list}
            data={data}
            schema={schema}
            schemaPath="definitions.value"
            itemRender={(item) => (
                <TranslationSchemaDefinitionsSpeechPart
                    data={item}
                    schema={schema}
                />
            )}
        />
    </>;
}

function TranslationSchemaDefinitionsSpeechPart(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaItem
                    title="Speech part"
                    data={data}
                    schema={schema}
                    schemaPath="definitions.speech_part.value"
                />
                <SchemaItem
                    title="Type"
                    data={data}
                    schema={schema}
                    schemaPath="definitions.type.value"
                />
                <SchemaItem
                    title="Items"
                    renderType={SchemaItemRenderType.list}
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.value"
                    itemRender={(item) => (
                        <TranslationSchemaDefinitionsItem
                            data={item}
                            schema={schema}
                        />
                    )}
                />
            </Stack>
        </ListItem>
    );
}

function TranslationSchemaDefinitionsItem(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaItem
                    title="Text"
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.text.value"
                />
                <SchemaItem
                    title="Example"
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.example.value"
                />
                <SchemaItem
                    title="Type"
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.type.value"
                />
                <SchemaItem
                    title="Synonyms"
                    renderType={SchemaItemRenderType.list}
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.synonyms.value"
                    itemRender={(item) => (
                        <TranslationSchemaDefinitionsSynonyms
                            data={item}
                            schema={schema}
                        />
                    )}
                />
            </Stack>
        </ListItem>
    );
}

function TranslationSchemaDefinitionsSynonyms(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaItem
                    title="Type"
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.synonyms.type.value"
                />
                <SchemaItem
                    title="Items"
                    renderType={SchemaItemRenderType.list}
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.synonyms.items.value"
                    itemRender={(item) => (
                        <TranslationSchemaDefinitionsSynonymItem
                            data={item}
                            schema={schema}
                        />
                    )}
                />
            </Stack>
        </ListItem>
    );
}

function TranslationSchemaDefinitionsSynonymItem(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <SchemaItem
                title="Text"
                data={data}
                schema={schema}
                schemaPath="definitions.items.synonyms.items.text.value"
            />
        </ListItem>
    );
}