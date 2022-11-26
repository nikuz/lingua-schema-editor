import React, { useState, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Collapsable,
    Form,
} from 'src/components';
import { translationController } from 'src/controllers';
import { jsonUtils } from 'src/utils';
import {
    FormFields,
    TranslationSchemaType,
} from 'src/types';
import {
    SchemaEditCache,
    SchemaEditCacheKeys,
    SetSchemaEditCacheCallback,
} from '../../types';
import SchemaEditTranslationBuilder from './components/schema-builder';
import SchemaEditTranslationPreview from './components/preview';

const {
    REACT_APP_TRANSLATION_URL,
    REACT_APP_TRANSLATION_MARKER,
    REACT_APP_TRANSLATION_BODY_PARAMETER,
    REACT_APP_TRANSLATION_BODY,
} = process.env;

export default function SchemaEditTranslation() {
    const [cache, setCache]: [SchemaEditCache, SetSchemaEditCacheCallback] = useOutletContext();
    const defaultSchema = useMemo<TranslationSchemaType>(() => ({
        fields: {
            url: REACT_APP_TRANSLATION_URL || '',
            parameter: REACT_APP_TRANSLATION_BODY_PARAMETER || '',
            body: REACT_APP_TRANSLATION_BODY || '',
            marker: REACT_APP_TRANSLATION_MARKER || '',
        },
    }), []);
    const [fields, setFields] = useState<FormFields>({
        url: {
            label: 'Url',
            value: defaultSchema.fields.url,
            fullWidth: true,
        },
        parameter: {
            label: 'Parameter',
            value: defaultSchema.fields.parameter,
        },
        body: {
            label: 'Body',
            value: defaultSchema.fields.body,
            variables: ['{marker}', '{word}', '{sourceLanguage}', '{targetLanguage}'],
            variablesValues: {
                '{marker}': defaultSchema.fields.marker,
            },
            type: 'textarea',
            fullWidth: true,
        }
    });
    const [translationResponseText, setTranslationResponseText] = useState<string | undefined>(cache.translation.responseText);
    const [translationResponseJson, setTranslationResponseJson] = useState<any>(cache.translation.responseJson);
    const [translationSchema, setTranslationSchema] = useState<TranslationSchemaType>({
        ...defaultSchema,
        ...cache.translation.schema,
    });

    const setFieldsHandler = useCallback((fields: FormFields) => {
        setFields(fields);
        const bodyVariables = fields.body.variablesValues;
        const schemaClone: TranslationSchemaType = {
            ...translationSchema,
            fields: {
                url: fields.url.value,
                parameter: fields.parameter.value,
                body: fields.body.value,
                marker: bodyVariables ? bodyVariables['{marker}'] : translationSchema.fields.marker,
            },
        };
        setTranslationSchema(schemaClone);
        setCache(SchemaEditCacheKeys.translation, {
            ...cache.translation,
            schema: schemaClone,
        });
    }, [translationSchema, cache, setCache]);

    const requestHandler = useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {
            // reset schema state
            setTranslationResponseText(undefined);
            setTranslationResponseJson(undefined);
            setTranslationSchema({
                fields: translationSchema.fields,
            });
            setCache(SchemaEditCacheKeys.translation, {
                responseText: undefined,
                responseJson: undefined,
                schema: {
                    fields: translationSchema.fields,
                },
            });

            const bodyVariables = fields.body.variablesValues;
            const marker = bodyVariables && bodyVariables['{marker}'];
            let bodyValue = fields.body.value;
            if (marker) {
                bodyValue.replace('{marker}', marker);
            }
            if (bodyVariables) {
                Object.keys(bodyVariables).forEach((key) => {
                    bodyValue = bodyValue.replace(key, bodyVariables[key]);
                });
            }

            const body = new URLSearchParams();
            body.append(fields.parameter.value, bodyValue);

            translationController.translate({
                url: fields.url.value,
                body,
            }).then(response => {
                if (marker) {
                    const translationRawStrings = response?.split('\n') ?? [];
                    let translationResult = '';

                    for (let i = 0, l = translationRawStrings.length; i < l; i++) {
                        if (translationRawStrings[i].includes(marker)) {
                            translationResult = translationRawStrings[i];
                            break;
                        }
                    }

                    if (translationResult !== '') {
                        setTranslationResponseText(translationResult);
                        setCache(SchemaEditCacheKeys.translation, {
                            ...cache.translation,
                            responseText: translationResult,
                        });
                        let data;
                        try {
                            data = JSON.parse(translationResult);
                            const allJsonStrings = jsonUtils.findAllJsonStrings(data);

                            if (allJsonStrings.length) {
                                const responseJson = JSON.parse(allJsonStrings[0]);
                                setTranslationResponseJson(responseJson);
                                setCache(SchemaEditCacheKeys.translation, {
                                    ...cache.translation,
                                    responseJson,
                                });
                                resolve();
                            } else {
                                reject(new Error('No JSON strings in the response'));
                            }
                        } catch (e) {
                            reject(new Error('Can\'t parse response JSON'));
                        }
                    }
                } else {
                    reject(new Error('No Marker set'));
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }, [fields, translationSchema, cache, setCache]);

    const populateSchemaHandler = useCallback((schemaPath: string, dataPath: string) => {
        const schema = jsonUtils.populateJsonByPath(translationSchema, schemaPath, dataPath);
        setTranslationSchema(schema);
        setCache(SchemaEditCacheKeys.translation, {
            ...cache.translation,
            schema,
        });
    }, [translationSchema, cache, setCache]);

    return (
        <>
            <Form
                fields={fields}
                onChange={setFieldsHandler}
                onSubmit={requestHandler}
            />
            {translationResponseJson && (
                <SchemaEditTranslationBuilder
                    data={translationResponseJson}
                    schema={translationSchema}
                    onDataPathSelect={populateSchemaHandler}
                />
            )}
            <Collapsable title="Schema" headerSize="h5" marginTop={5} marginBottom={3}>
                <pre>
                    {JSON.stringify(translationSchema, null, 4)}
                </pre>
            </Collapsable>
            {translationResponseText && (
                <Collapsable title="Original response">
                    {translationResponseText}
                </Collapsable>
            )}
            {translationResponseJson && (
                <SchemaEditTranslationPreview
                    schema={translationSchema}
                    translationResponseJson={translationResponseJson}
                />
            )}
        </>
    );
}
