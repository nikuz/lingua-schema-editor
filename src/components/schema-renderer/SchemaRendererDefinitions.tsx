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

export default function SchemaRendererDefinitions(props: Props) {
    const { data, schema } = props;

    return <>
        <Typography variant="h6" sx={{ mt: 2 }}>Definitions</Typography>
        <SchemaRendererItem
            title="Speech parts"
            type={SchemaRendererItemType.list}
            data={data}
            schema={schema}
            schemaPath="definitions.value"
            itemRender={(item) => (
                <SchemaRendererDefinitionsSpeechPart
                    data={item}
                    schema={schema}
                />
            )}
        />
    </>;
}

function SchemaRendererDefinitionsSpeechPart(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaRendererItem
                    title="Speech part"
                    data={data}
                    schema={schema}
                    schemaPath="definitions.speech_part.value"
                />
                <SchemaRendererItem
                    title="Type"
                    data={data}
                    schema={schema}
                    schemaPath="definitions.type.value"
                />
                <SchemaRendererItem
                    title="Items"
                    type={SchemaRendererItemType.list}
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.value"
                    itemRender={(item) => (
                        <SchemaRendererDefinitionsItem
                            data={item}
                            schema={schema}
                        />
                    )}
                />
            </Stack>
        </ListItem>
    );
}

function SchemaRendererDefinitionsItem(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaRendererItem
                    title="Text"
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.text.value"
                />
                <SchemaRendererItem
                    title="Example"
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.example.value"
                />
                <SchemaRendererItem
                    title="Type"
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.type.value"
                />
                <SchemaRendererItem
                    title="Synonyms"
                    type={SchemaRendererItemType.list}
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.synonyms.value"
                    itemRender={(item) => (
                        <SchemaRendererDefinitionsSynonyms
                            data={item}
                            schema={schema}
                        />
                    )}
                />
            </Stack>
        </ListItem>
    );
}

function SchemaRendererDefinitionsSynonyms(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaRendererItem
                    title="Type"
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.synonyms.type.value"
                />
                <SchemaRendererItem
                    title="Items"
                    type={SchemaRendererItemType.list}
                    data={data}
                    schema={schema}
                    schemaPath="definitions.items.synonyms.items.value"
                    itemRender={(item) => (
                        <SchemaRendererDefinitionsSynonymItem
                            data={item}
                            schema={schema}
                        />
                    )}
                />
            </Stack>
        </ListItem>
    );
}

function SchemaRendererDefinitionsSynonymItem(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <SchemaRendererItem
                title="Text"
                data={data}
                schema={schema}
                schemaPath="definitions.items.synonyms.items.text.value"
            />
        </ListItem>
    );
}