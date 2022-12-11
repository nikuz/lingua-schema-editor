import React, { useState, useCallback, useEffect } from 'react';
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
    TranslationSchemaTypeFieldsName,
    Language,
} from 'src/types';
import {
    SchemaEditCache,
    SchemaEditCacheKeys,
    SetSchemaEditCacheCallback,
} from '../types';
import SchemaEditTranslationBuilder from './components/schema-builder';
import SchemaEditTranslationPreview from './components/preview';

const {
    REACT_APP_TRANSLATION_URL,
    REACT_APP_TRANSLATION_MARKER,
    REACT_APP_TRANSLATION_BODY_PARAMETER,
    REACT_APP_TRANSLATION_BODY,
} = process.env;

export default function SchemaEditTranslation() {
    const [cache, setCache, languages]: [SchemaEditCache, SetSchemaEditCacheCallback, Language[]] = useOutletContext();
    const [fields, setFields] = useState<FormFields>({
        url: {
            label: 'Url',
            value: cache.translation.schema?.fields.url || REACT_APP_TRANSLATION_URL || '',
            fullWidth: true,
        },
        parameter: {
            label: 'Parameter',
            value: cache.translation.schema?.fields.parameter || REACT_APP_TRANSLATION_BODY_PARAMETER || '',
        },
        body: {
            label: 'Body',
            value: cache.translation.schema?.fields.body || REACT_APP_TRANSLATION_BODY || '',
            variables: ['{marker}', '{word}', '{sourceLanguage}', '{targetLanguage}'],
            variablesValues: {
                '{marker}': cache.translation.schema?.fields.marker || REACT_APP_TRANSLATION_MARKER || '',
            },
            type: 'textarea',
            fullWidth: true,
        }
    });

    const setFieldsHandler = useCallback((fields: FormFields) => {
        setFields(fields);
        const bodyVariables = fields.body.variablesValues;
        setCache(SchemaEditCacheKeys.translation, {
            ...cache.translation,
            schema: {
                ...cache.translation.schema,
                fields: {
                    url: fields.url.value,
                    parameter: fields.parameter.value,
                    body: fields.body.value,
                    marker: bodyVariables
                        ? bodyVariables['{marker}']
                        : cache.translation.schema?.fields.marker || '',
                },
            },
        });
    }, [cache, setCache]);

    const requestHandler = useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {
            // clear response text and json states
            if (cache.translation.responseText && cache.translation.responseJson) {
                setCache(SchemaEditCacheKeys.translation, {
                    ...cache.translation,
                    responseText: undefined,
                    responseJson: undefined,
                });
            }

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
                        let data;
                        try {
                            data = JSON.parse(translationResult);
                            const allJsonStrings = jsonUtils.findAllJsonStrings(data);

                            if (allJsonStrings.length) {
                                const responseJson = JSON.parse(allJsonStrings[0]);
                                setCache(SchemaEditCacheKeys.translation, {
                                    ...cache.translation,
                                    responseJson,
                                    responseText: translationResult,
                                });
                                return resolve();
                            } else {
                                reject(new Error('No JSON strings in the response'));
                            }
                        } catch (e) {
                            reject(new Error('Can\'t parse response JSON'));
                        }
                        // set only responseText if previous conditions have failed
                        setCache(SchemaEditCacheKeys.translation, {
                            ...cache.translation,
                            responseText: translationResult,
                        });
                    }
                } else {
                    reject(new Error('No Marker set'));
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }, [fields, cache, setCache]);

    const populateSchemaHandler = useCallback((schemaPath: string, dataPath: string) => {
        const schema = jsonUtils.populateJsonByPath(cache.translation.schema || {}, schemaPath, dataPath);
        setCache(SchemaEditCacheKeys.translation, {
            ...cache.translation,
            schema,
        });
    }, [cache, setCache]);

    // set fields values from cloud
    useEffect(() => {
        const schemaFields = cache.translation.schema?.fields;
        if (!cache.translation.initiated && schemaFields) {
            const fieldsClone = { ...fields };
            Object.keys(schemaFields).forEach(item => {
                const key = item as TranslationSchemaTypeFieldsName;
                if (fieldsClone[key]) {
                    fieldsClone[key].value = schemaFields[key];
                }
                if (key === 'marker' && fieldsClone.body) {
                    fieldsClone.body.variablesValues = {
                        ...fieldsClone.body.variablesValues,
                        '{marker}': schemaFields[key],
                    }
                }
            });
            setFields(fieldsClone);
            setCache(SchemaEditCacheKeys.translation, {
                ...cache.translation,
                initiated: true,
            });
        }
    }, [fields, cache, setCache]);

    return (
        <>
            <Form
                fields={fields}
                languages={languages}
                onChange={setFieldsHandler}
                onSubmit={requestHandler}
            />
            {cache.translation.responseJson && (
                <SchemaEditTranslationBuilder
                    data={cache.translation.responseJson}
                    schema={cache.translation.schema || {} as TranslationSchemaType}
                    onDataPathSelect={populateSchemaHandler}
                />
            )}
            <Collapsable title="Schema" headerSize="h5" marginTop={5} marginBottom={3}>
                <pre>
                    {JSON.stringify(cache.translation.schema || {}, null, 4)}
                </pre>
            </Collapsable>
            {cache.translation.responseText && (
                <Collapsable title="Original response">
                    {cache.translation.responseText}
                </Collapsable>
            )}
            {cache.translation.responseJson && (
                <SchemaEditTranslationPreview
                    schema={cache.translation.schema || {} as TranslationSchemaType}
                    translationResponseJson={cache.translation.responseJson}
                />
            )}
        </>
    );
}
