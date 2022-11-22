import React from 'react';
import jmespath from 'jmespath';
import {
    ListItem,
    Stack,
    Typography,
} from '@mui/material';
import { TranslationSchemaDefinitions } from '../../types';
import SchemaRendererItem, { SchemaRendererItemType } from './SchemaRendererItem';

interface Props {
    data: any,
    schema?: TranslationSchemaDefinitions,
}

export default function SchemaRendererDefinitions(props: Props) {
    const { data, schema } = props;
    const definitions = schema ? jmespath.search(data, schema.value) : undefined;

    return <>
        <Typography variant="h6" sx={{ mt: 2 }}>Definitions</Typography>
        <SchemaRendererItem
            title="Speech parts"
            value={definitions}
            type={SchemaRendererItemType.list}
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
    const speechPart = schema?.speech_part
        ? jmespath.search(data, schema.speech_part.value)
        : undefined;
    const type = schema?.type
        ? jmespath.search(data, schema.type.value)
        : undefined;
    const items = schema?.items
        ? jmespath.search(data, schema.items.value)
        : undefined;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaRendererItem title="Speech part" value={speechPart} />
                <SchemaRendererItem title="Type" value={type} />
                <SchemaRendererItem
                    title="Items"
                    value={items}
                    type={SchemaRendererItemType.list}
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
    const text = schema?.items?.text
        ? jmespath.search(data, schema.items.text.value)
        : undefined;
    const example = schema?.items?.example
        ? jmespath.search(data, schema.items.example.value)
        : undefined;
    const type = schema?.items?.type
        ? jmespath.search(data, schema.items.type.value)
        : undefined;
    const synonyms = schema?.items?.synonyms
        ? jmespath.search(data, schema.items.synonyms.value)
        : undefined;

    return (
        <ListItem sx={{ pl: 6 }}>
            <Stack spacing={1}>
                <SchemaRendererItem title="Text" value={text} />
                <SchemaRendererItem title="Example" value={example} />
                <SchemaRendererItem title="Type" value={type} />
                <SchemaRendererItem
                    title="Synonyms"
                    value={synonyms}
                    type={SchemaRendererItemType.list}
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
    const type = schema?.items?.synonyms?.type
        ? jmespath.search(data, schema.items.synonyms.type.value)
        : undefined;
    const items = schema?.items?.synonyms?.items
        ? jmespath.search(data, schema.items.synonyms.items.value)
        : undefined;

    return (
        <ListItem sx={{ pl: 9 }}>
            <Stack spacing={1}>
                <SchemaRendererItem title="Type" value={type} />
                <SchemaRendererItem
                    title="Items"
                    value={items}
                    type={SchemaRendererItemType.list}
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
    const text = schema?.items?.synonyms?.items?.text
        ? jmespath.search(data, schema.items.synonyms.items.text.value)
        : undefined;

    return <SchemaRendererItem title="Text" value={text} />;
}