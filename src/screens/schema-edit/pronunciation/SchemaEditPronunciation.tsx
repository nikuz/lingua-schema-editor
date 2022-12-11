import React, { useCallback, useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Collapsable,
    Form,
} from 'src/components';
import { translationController } from 'src/controllers';
import { jsonUtils } from 'src/utils';
import {
    FormFields,
    PronunciationSchemaType,
    PronunciationSchemaTypeFieldsName,
    Language,
} from 'src/types';
import {
    SchemaEditCache,
    SchemaEditCacheKeys,
    SetSchemaEditCacheCallback,
} from '../types';
import SchemaEditPronunciationBuilder from './components/schema-builder';
import SchemaEditPronunciationPreview from './components/preview';

const {
    REACT_APP_TRANSLATION_URL,
    REACT_APP_PRONUNCIATION_MARKER,
    REACT_APP_TRANSLATION_BODY_PARAMETER,
    REACT_APP_PRONUNCIATION_BODY,
    REACT_APP_PRONUNCIATION_BASE64_PREFIX,
} = process.env;

export default function SchemaEditPronunciation() {
    const [cache, setCache, languages]: [SchemaEditCache, SetSchemaEditCacheCallback, Language[]] = useOutletContext();
    const [fields, setFields] = useState<FormFields>({
        url: {
            label: 'Url',
            value: cache.pronunciation.schema?.fields.url || REACT_APP_TRANSLATION_URL || '',
            fullWidth: true,
        },
        parameter: {
            label: 'Parameter',
            value: cache.pronunciation.schema?.fields.parameter || REACT_APP_TRANSLATION_BODY_PARAMETER || '',
        },
        body: {
            label: 'Body',
            value: cache.pronunciation.schema?.fields.body || REACT_APP_PRONUNCIATION_BODY || '',
            variables: ['{marker}', '{word}', '{sourceLanguage}'],
            variablesValues: {
                '{marker}': cache.pronunciation.schema?.fields.marker || REACT_APP_PRONUNCIATION_MARKER || '',
            },
            type: 'textarea',
            fullWidth: true,
        },
        base64Prefix: {
            label: 'Base 64 prefix',
            value: cache.pronunciation.schema?.fields.base64Prefix || REACT_APP_PRONUNCIATION_BASE64_PREFIX || '',
            fullWidth: true,
        }
    });

    const setFieldsHandler = useCallback((fields: FormFields) => {
        setFields(fields);
        const bodyVariables = fields.body.variablesValues;
        setCache(SchemaEditCacheKeys.pronunciation, {
            ...cache.pronunciation,
            schema: {
                ...cache.pronunciation.schema,
                fields: {
                    url: fields.url.value,
                    parameter: fields.parameter.value,
                    body: fields.body.value,
                    marker: bodyVariables
                        ? bodyVariables['{marker}']
                        : cache.pronunciation.schema?.fields.marker || '',
                    base64Prefix: fields.base64Prefix.value,
                },
            },
        });
    }, [cache, setCache]);

    const requestHandler = useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {
            // clear response text and json states
            if (cache.pronunciation.responseText && cache.pronunciation.responseJson) {
                setCache(SchemaEditCacheKeys.pronunciation, {
                    ...cache.pronunciation,
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
                                setCache(SchemaEditCacheKeys.pronunciation, {
                                    ...cache.pronunciation,
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
                        setCache(SchemaEditCacheKeys.pronunciation, {
                            ...cache.pronunciation,
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
        const schema = jsonUtils.populateJsonByPath(cache.pronunciation.schema || {}, schemaPath, dataPath);
        setCache(SchemaEditCacheKeys.pronunciation, {
            ...cache.pronunciation,
            schema,
        });
    }, [cache, setCache]);

    // set fields values from cloud
    useEffect(() => {
        const schemaFields = cache.pronunciation.schema?.fields;
        if (!cache.pronunciation.initiated && schemaFields) {
            const fieldsClone = { ...fields };
            Object.keys(schemaFields).forEach(item => {
                const key = item as PronunciationSchemaTypeFieldsName;
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
            setCache(SchemaEditCacheKeys.pronunciation, {
                ...cache.pronunciation,
                initiated: true,
            });
        }
    }, [fields, cache, setCache]);

    return <>
        <Form
            fields={fields}
            languages={languages}
            onChange={setFieldsHandler}
            onSubmit={requestHandler}
        />
        {cache.pronunciation.responseJson && (
            <SchemaEditPronunciationBuilder
                data={cache.pronunciation.responseJson}
                schema={cache.pronunciation.schema || {} as PronunciationSchemaType}
                onDataPathSelect={populateSchemaHandler}
            />
        )}
        <Collapsable title="Schema" headerSize="h5" marginTop={5} marginBottom={3}>
            <pre>
                {JSON.stringify(cache.pronunciation.schema || {}, null, 4)}
            </pre>
        </Collapsable>
        {cache.pronunciation.responseText && (
            <Collapsable title="Original response">
                <div className="text-ellipsis">
                    {cache.pronunciation.responseText}
                </div>
            </Collapsable>
        )}
        {cache.pronunciation.responseJson && (
            <SchemaEditPronunciationPreview
                schema={cache.pronunciation.schema || {} as PronunciationSchemaType}
                translateResponseJson={cache.pronunciation.responseJson}
            />
        )}
    </>;
}
