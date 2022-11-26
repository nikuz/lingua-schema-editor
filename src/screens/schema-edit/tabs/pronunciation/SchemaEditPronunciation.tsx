import React, { useCallback, useState, useMemo } from 'react';
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
} from 'src/types';
import {
    SchemaEditCache,
    SchemaEditCacheKeys,
    SetSchemaEditCacheCallback,
} from '../../types';
import SchemaEditPronunciationBuilder from './components/builder';
import SchemaEditPronunciationPreview from './components/preview';

const {
    REACT_APP_TRANSLATION_URL,
    REACT_APP_PRONUNCIATION_MARKER,
    REACT_APP_TRANSLATION_BODY_PARAMETER,
    REACT_APP_PRONUNCIATION_BODY,
} = process.env;

export default function SchemaEditPronunciation() {
    const [cache, setCache]: [SchemaEditCache, SetSchemaEditCacheCallback] = useOutletContext();
    const defaultSchema = useMemo<PronunciationSchemaType>(() => ({
        url: REACT_APP_TRANSLATION_URL || '',
        parameter: REACT_APP_TRANSLATION_BODY_PARAMETER || '',
        body: REACT_APP_PRONUNCIATION_BODY || '',
        marker: REACT_APP_PRONUNCIATION_MARKER || '',
        base64Prefix: 'data:audio/mp3;base64,',
    }), []);
    const [fields, setFields] = useState<FormFields>({
        url: {
            label: 'Url',
            value: defaultSchema.url,
            fullWidth: true,
        },
        parameter: {
            label: 'Parameter',
            value: defaultSchema.parameter,
        },
        body: {
            label: 'Body',
            value: defaultSchema.body,
            variables: ['{marker}', '{word}', '{sourceLanguage}'],
            variablesValues: {
                '{marker}': defaultSchema.marker,
            },
            type: 'textarea',
            fullWidth: true,
        },
        base64Prefix: {
            label: 'Base 64 prefix',
            value: defaultSchema.base64Prefix,
            fullWidth: true,
        }
    });
    const [pronunciationResponseText, setPronunciationResponseText] = useState<string| undefined>(cache.pronunciation.responseText);
    const [pronunciationResponseJson, setPronunciationResponseJson] = useState<any>(cache.pronunciation.responseJson);
    const [pronunciationSchema, setPronunciationSchema] = useState<PronunciationSchemaType>({
        ...defaultSchema,
        ...cache.pronunciation.schema,
    });

    const setFieldsHandler = useCallback((fields: FormFields) => {
        setFields(fields);
        const bodyVariables = fields.body.variablesValues;
        const schemaClone = {
            ...pronunciationSchema,
            url: fields.url.value,
            parameter: fields.parameter.value,
            body: fields.body.value,
            marker: bodyVariables ? bodyVariables['{marker}'] : pronunciationSchema.marker,
            base64Prefix: fields.base64Prefix.value,
        };
        setPronunciationSchema(schemaClone);
        setCache(SchemaEditCacheKeys.pronunciation, {
            ...cache.pronunciation,
            schema: schemaClone,
        });
    }, [pronunciationSchema, cache, setCache]);

    const requestHandler = useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {
            // reset schema state
            setPronunciationResponseText(undefined);
            setPronunciationResponseJson(undefined);
            setPronunciationSchema(defaultSchema);
            setCache(SchemaEditCacheKeys.pronunciation, {
                responseText: undefined,
                responseJson: undefined,
                schema: defaultSchema,
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
                        setCache(SchemaEditCacheKeys.pronunciation, {
                            ...cache.pronunciation,
                            responseText: translationResult,
                        });

                        let data;
                        try {
                            data = JSON.parse(translationResult);
                            const allJsonStrings = jsonUtils.findAllJsonStrings(data);

                            if (allJsonStrings.length) {
                                const responseJson = JSON.parse(allJsonStrings[0]);
                                setPronunciationResponseJson(responseJson);
                                setCache(SchemaEditCacheKeys.pronunciation, {
                                    ...cache.pronunciation,
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
    }, [defaultSchema, fields, cache, setCache]);

    const populateSchemaHandler = useCallback((schemaPath: string, dataPath: string) => {
        const schema = jsonUtils.populateJsonByPath(pronunciationSchema, schemaPath, dataPath);
        setPronunciationSchema(schema);
        setCache(SchemaEditCacheKeys.pronunciation, {
            ...cache.pronunciation,
            schema,
        });
    }, [pronunciationSchema, cache, setCache]);

    return <>
        <Form
            fields={fields}
            onChange={setFieldsHandler}
            onSubmit={requestHandler}
        />
        {pronunciationResponseJson && (
            <SchemaEditPronunciationBuilder
                data={pronunciationResponseJson}
                schema={pronunciationSchema}
                onDataPathSelect={populateSchemaHandler}
            />
        )}
        {pronunciationResponseText && (
            <Collapsable title="Original response">
                <div className="text-ellipsis">
                    {pronunciationResponseText}
                </div>
            </Collapsable>
        )}
        {pronunciationResponseJson && (
            <SchemaEditPronunciationPreview
                schema={pronunciationSchema}
                translateResponseJson={pronunciationResponseJson}
            />
        )}
    </>;
}
