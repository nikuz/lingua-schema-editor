import React, { useCallback, useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import jmespath from 'jmespath';
import { Box } from '@mui/material';
import {
    Collapsable,
    Form,
} from 'src/components';
import { translationController } from 'src/controllers';
import { jsonUtils } from 'src/utils';
import {
    FormFields,
    PronunciationSchemaType,
    ResultSchemaKeys,
    SetResultSchemaCallback,
} from 'src/types';
import PronunciationSchema from './schema';

const {
    REACT_APP_TRANSLATION_URL,
    REACT_APP_PRONUNCIATION_MARKER,
    REACT_APP_TRANSLATION_BODY_PARAMETER,
    REACT_APP_PRONUNCIATION_BODY,
} = process.env;

export default function SchemaEditPronunciation() {
    const setResultSchema: SetResultSchemaCallback = useOutletContext();
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
    const [translateResponseText, setTranslateResponseText] = useState<string>();
    const [translateResponseJson, setTranslateResponseJson] = useState<{}>();
    const [pronunciationSchema, setPronunciationSchema] = useState<PronunciationSchemaType>(defaultSchema);

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
        setResultSchema(ResultSchemaKeys.pronunciation, schemaClone);
    }, [pronunciationSchema, setResultSchema]);

    const requestHandler = useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {
            // reset schema state
            setTranslateResponseText(undefined);
            setTranslateResponseJson(undefined);
            setPronunciationSchema(defaultSchema);
            setResultSchema(ResultSchemaKeys.pronunciation, defaultSchema);

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
                        setTranslateResponseText(translationResult);
                        let data;
                        try {
                            data = JSON.parse(translationResult);
                            const allJsonStrings = jsonUtils.findAllJsonStrings(data);

                            if (allJsonStrings.length) {
                                setTranslateResponseJson(JSON.parse(allJsonStrings[0]));
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
    }, [defaultSchema, fields, setResultSchema]);

    const populateSchemaHandler = useCallback((schemaPath: string, dataPath: string) => {
        const schema = jsonUtils.populateJsonByPath(pronunciationSchema, schemaPath, dataPath);
        setPronunciationSchema(schema);
        setResultSchema(ResultSchemaKeys.pronunciation, schema);
    }, [pronunciationSchema, setResultSchema]);

    return <>
        <Form
            fields={fields}
            onChange={setFieldsHandler}
            onSubmit={requestHandler}
        />
        {translateResponseJson && (
            <PronunciationSchema
                data={translateResponseJson}
                schema={pronunciationSchema}
                onDataPathSelect={populateSchemaHandler}
            />
        )}
        {translateResponseText && (
            <Collapsable title="Original response">
                <div className="text-ellipsis">
                    {translateResponseText}
                </div>
            </Collapsable>
        )}
        {pronunciationSchema.data && pronunciationSchema.data.value !== '' && (
            <Box sx={{ mt: 4 }}>
                <audio
                    src={`${pronunciationSchema.base64Prefix}${jmespath.search(translateResponseJson, pronunciationSchema.data.value)}`}
                    controls
                    autoPlay
                />
            </Box>
        )}
    </>;
}
