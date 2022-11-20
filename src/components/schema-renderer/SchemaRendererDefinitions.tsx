import React from 'react';
import jmespath from 'jmespath';
import {
    Alert,
    List,
    ListItem,
    Stack,
    Typography,
    Divider,
} from '@mui/material';
import { TranslationSchemaDefinitions } from '../../types';

interface Props {
    data: any,
    definitionsSchema?: TranslationSchemaDefinitions,
}

export default function SchemaRendererDefinitions(props: Props) {
    const { data, definitionsSchema } = props;
    const definitions = definitionsSchema ? jmespath.search(data, definitionsSchema.value) : undefined;

    return (
        <div className="schema-renderer">
            <Typography variant="h6">Definitions</Typography>
            {definitions && Array.isArray(definitions)
                ? <div>
                    <Typography variant="subtitle1">Speech parts</Typography>
                    <List>
                        {definitions.map((speechPartItem: any, key) => (
                            <React.Fragment key={`speech-part-${key}`}>
                                <SchemaRendererDefinitionsSpeechPart
                                    data={speechPartItem}
                                    definitionsSchema={definitionsSchema}
                                />
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </div>
                : <Alert severity="error">
                    Definitions are not defined in schema or not a list
                </Alert>
            }
        </div>
    );
}

function SchemaRendererDefinitionsSpeechPart(props: Props) {
    const { data, definitionsSchema } = props;
    const speechPart = definitionsSchema?.speech_part
        ? jmespath.search(data, definitionsSchema.speech_part.value)
        : undefined;
    const type = definitionsSchema?.type
        ? jmespath.search(data, definitionsSchema.type.value)
        : undefined;
    const items = definitionsSchema?.items
        ? jmespath.search(data, definitionsSchema.items.value)
        : undefined;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={2}>
                {speechPart !== undefined
                    ? <Alert>Speech part: {String(speechPart)}</Alert>
                    : <Alert severity="error">Speech part is not defined in schema</Alert>
                }
                {type !== undefined
                    ? <Alert>Type: {String(type)}</Alert>
                    : <Alert severity="info">Speech part type is not defined in schema</Alert>
                }
                {items && Array.isArray(items)
                    ? <div>
                        <Typography variant="subtitle1">Items</Typography>
                        <List>
                            {items.map((definitionItem: any, key) => (
                                <React.Fragment key={`definition-${key}`}>
                                    <SchemaRendererDefinitionsItem
                                        data={definitionItem}
                                        definitionsSchema={definitionsSchema}
                                    />
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </div>
                    : <Alert severity="error">Speech part items is not defined in schema or not a list</Alert>
                }
            </Stack>
        </ListItem>
    );
}

function SchemaRendererDefinitionsItem(props: Props) {
    const { data, definitionsSchema } = props;
    const text = definitionsSchema?.items?.text
        ? jmespath.search(data, definitionsSchema.items.text.value)
        : undefined;
    const example = definitionsSchema?.items?.example
        ? jmespath.search(data, definitionsSchema.items.example.value)
        : undefined;
    const type = definitionsSchema?.items?.type
        ? jmespath.search(data, definitionsSchema.items.type.value)
        : undefined;
    const synonyms = definitionsSchema?.items?.synonyms
        ? jmespath.search(data, definitionsSchema.items.synonyms.value)
        : undefined;

    return (
        <ListItem sx={{ pl: 6 }}>
            <Stack spacing={2}>
                {text !== undefined
                    ? <Alert>Text: {String(text)}</Alert>
                    : <Alert severity="error">Definition text is not defined in schema</Alert>
                }
                {example !== undefined
                    ? <Alert>Example: {String(example)}</Alert>
                    : <Alert severity="info">Definition example is not defined in schema</Alert>
                }
                {type !== undefined
                    ? <Alert>Type: {String(type)}</Alert>
                    : <Alert severity="info">Definition type is not defined in schema</Alert>
                }
                {synonyms !== undefined
                    ? <div>
                        <Typography variant="subtitle1">Synonyms</Typography>
                        <List>
                            {Array.isArray(synonyms)
                                ? synonyms.map((definitionItem: any, key) => (
                                    <SchemaRendererDefinitionsSynonym
                                            key={`synonym-${key}`}
                                            data={definitionItem}
                                            definitionsSchema={definitionsSchema}
                                        />
                                    ))
                                : String(synonyms)
                            }
                        </List>
                    </div>
                    : <Alert severity="error">Definition synonyms is not defined in schema</Alert>
                }
            </Stack>
        </ListItem>
    );
}

function SchemaRendererDefinitionsSynonym(props: Props) {
    const { data, definitionsSchema } = props;
    const type = definitionsSchema?.items?.synonyms?.type
        ? jmespath.search(data, definitionsSchema.items.synonyms.type.value)
        : undefined;
    const items = definitionsSchema?.items?.synonyms?.items
        ? jmespath.search(data, definitionsSchema.items.synonyms.items.value)
        : undefined;

    return (
        <ListItem sx={{ pl: 9 }}>
            <Stack spacing={2}>
                {type !== undefined
                    ? <Alert>Type: {String(type)}</Alert>
                    : <Alert severity="info">Definition type is not defined in schema</Alert>
                }
                {items !== undefined
                    ? <div>
                        {Array.isArray(items)
                            ? items.map((synonymItem: any, key) => {
                                const text = definitionsSchema?.items?.synonyms?.items?.text
                                    ? jmespath.search(synonymItem, definitionsSchema.items.synonyms.items.text.value)
                                    : undefined;

                                if (text) {
                                    return <span key={key}>{text}, </span>;
                                }

                                return <Alert severity="error" key={key}>Synonyms text is not defined in schema</Alert>;
                            })
                            : String(items)
                        }
                    </div>
                    : <Alert severity="error">Synonym items are not defined in schema</Alert>
                }
            </Stack>
        </ListItem>
    );
}
