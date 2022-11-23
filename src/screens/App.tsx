import React, { useState, useCallback, useEffect } from 'react';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormLabel,
    Alert,
    CircularProgress,
} from '@mui/material';
import { translateController } from '../controllers';
import { localStorageProvider } from '../providers';
import { SchemaRenderer, Collapsable } from '../components';
import { jsonUtils } from '../utils';
import { TranslationSchema } from '../types';
import supportedLanguages from './data/supported-languages.json';
// import data from './data/man.json';
import './App.css';

const {
    REACT_APP_TRANSLATION_URL,
    REACT_APP_TRANSLATION_MARKER,
    REACT_APP_TRANSLATION_BODY_PARAMETER,
    REACT_APP_TRANSLATION_BODY,
} = process.env;

const bodyParameterMandatoryVariables = ['{marker}', '{word}', '{sourceLanguage}', '{targetLanguage}'];

export default function App() {
    const [url, setUrl] = useState<string>('');
    const [bodyParameterName, setBodyParameterName] = useState<string>('');
    const [bodyParameterValue, setBodyParameterValue] = useState<string>('');
    const [bodyParameterValidationError, setBodyParameterValidationError] = useState(false);
    const [variablesValues, setVariablesValues] = useState<Map<string, string>>(new Map());
    const [translateResponseText, setTranslateResponseText] = useState<string>();
    const [translateResponseJson, setTranslateResponseJson] = useState<{}>();
    const [resultSchema, setResultSchema] = useState<TranslationSchema>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();

    const requestHandler = useCallback(() => {
        setLoading(true);
        let body = bodyParameterValue;
        variablesValues.forEach((value, key) => {
            body = body.replace(key, value);
        });

        translateController.translate({
            url,
            body: {
                [bodyParameterName]: body,
            },
        }).then(response => {
            setLoading(false);
            const marker = variablesValues.get('{marker}');
            if (marker) {
                const translationRawStrings = response?.split('\n') ?? [];
                let translationResult = '';

                for (let i = 0, l = translationRawStrings.length; i < l; i++) {
                    if (translationRawStrings[i].includes(marker)) {
                        translationResult = translationRawStrings[i];
                        break;
                    }
                }

                setTranslateResponseText(translationResult);

                if (translationResult !== '') {
                    let data;
                    try {
                        data = JSON.parse(translationResult);
                        const allJsonStrings = jsonUtils.findAllJsonStrings(data);

                        if (allJsonStrings.length) {
                            data = JSON.parse(allJsonStrings[0]);
                        }

                        setTranslateResponseJson(data);
                    } catch (e) {
                        setError(new Error('Can\'t parse response JSON'));
                    }
                }
            }
        }).catch(err => {
            setLoading(false);
            setError(err);
        });
    }, [url, bodyParameterName, bodyParameterValue, variablesValues]);

    const bodyParameterValidationHandler = useCallback((value: string) => {
        let allVariablesIncluded = true;

        for (const item of bodyParameterMandatoryVariables) {
            if (!value.includes(item)) {
                allVariablesIncluded = false;
                break;
            }
        }

        if (!allVariablesIncluded && !bodyParameterValidationError) {
            setBodyParameterValidationError(true);
        } else if (allVariablesIncluded && bodyParameterValidationError) {
            setBodyParameterValidationError(false);
        }
    }, [bodyParameterValidationError]);

    const populateSchemaHandler = useCallback((schemaPath: string, dataPath: string) => {
        // deep copy
        const schema = JSON.parse(JSON.stringify(resultSchema));
        const schemaPathParts = schemaPath.split('.');
        let schemaPointer = schema;

        for (let i = 0, l = schemaPathParts.length; i < l; i++) {
            const part = schemaPathParts[i];
            if (!schemaPointer[part]) {
                schemaPointer[part] = {};
            }
            if (i === l - 1) {
                schemaPointer[part] = dataPath;
                break;
            }
            schemaPointer = schemaPointer[part];
        }
        setResultSchema(schema);
    }, [resultSchema]);

    const variablesValuesChangeHandler = useCallback((id: string, value: string) => {
        const variablesValuesClone = new Map(variablesValues);
        variablesValuesClone.set(id, value);
        setVariablesValues(variablesValuesClone);
        if (id === '{marker}') {
            localStorageProvider.setItem('{marker}', value);
        }
    }, [variablesValues]);

    useEffect(() => {
        const storedUrl = localStorageProvider.getItem('url') || REACT_APP_TRANSLATION_URL || '';
        const storedParameterName = localStorageProvider.getItem('bodyParameterName') || REACT_APP_TRANSLATION_BODY_PARAMETER || '';
        const storedParameterValue = localStorageProvider.getItem('bodyParameterValue') || REACT_APP_TRANSLATION_BODY || '';
        const storedMarker = localStorageProvider.getItem('{marker}') || REACT_APP_TRANSLATION_MARKER || '';

        setUrl(storedUrl);
        setBodyParameterName(storedParameterName);
        setBodyParameterValue(storedParameterValue);

        const variablesValuesInitial = new Map();
        variablesValuesInitial.set('{marker}', storedMarker);
        setVariablesValues(variablesValuesInitial);
    }, []);

    useEffect(() => {
        bodyParameterValidationHandler(bodyParameterValue);
    }, [bodyParameterValue, bodyParameterValidationHandler]);

    // TODO: remove in production
    // useEffect(() => {
    //     setTranslateResponseJson(data);
    // }, []);
    //

    return (
        <div className="app-container">
            <div className="form-row">
                <TextField
                    variant="outlined"
                    label="Url"
                    size="small"
                    value={url}
                    fullWidth
                    onChange={(event) => {
                        setUrl(event.target.value);
                        localStorageProvider.setItem('url', event.target.value);
                    }}
                />
            </div>
            <div className="form-row">
                <TextField
                    variant="outlined"
                    label="Body parameter name"
                    size="small"
                    value={bodyParameterName}
                    onChange={(event) => {
                        setBodyParameterName(event.target.value);
                        localStorageProvider.setItem('bodyParameterName', event.target.value);
                    }}
                />
            </div>
            <div className="form-row">
                <TextField
                    variant="outlined"
                    label="Body parameter value"
                    size="small"
                    multiline
                    minRows={5}
                    fullWidth
                    value={bodyParameterValue}
                    error={bodyParameterValidationError}
                    helperText={`Must include ${bodyParameterMandatoryVariables.join(', ')} variables`}
                    onChange={(event) => {
                        setBodyParameterValue(event.target.value);
                        localStorageProvider.setItem('bodyParameterValue', event.target.value);
                    }}
                />
            </div>
            <div className="form-row">
                {bodyParameterMandatoryVariables.map(item => {
                    const isLanguageSelector = item.toLocaleLowerCase().includes('language');
                    return (
                        <div key={item} className="form-element-horizontal">
                            <div>
                                <FormLabel id={item}>{item} value</FormLabel>
                            </div>
                            {isLanguageSelector && (
                                <Select
                                    value={variablesValues.get(item) || ''}
                                    size="small"
                                    onChange={(event) => {
                                        variablesValuesChangeHandler(item, event.target.value);
                                    }}
                                >
                                    {supportedLanguages.map(language => (
                                        <MenuItem
                                            key={language.id}
                                            value={language.id}
                                        >
                                            {language.value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                            {!isLanguageSelector && (
                                <TextField
                                    value={variablesValues.get(item) || ''}
                                    variant="outlined"
                                    size="small"
                                    onChange={(event) => {
                                        variablesValuesChangeHandler(item, event.target.value);
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="form-row">
                <Button
                    variant="contained"
                    onClick={requestHandler}
                    disabled={!bodyParameterMandatoryVariables.every(item => (
                        variablesValues.has(item)
                        && variablesValues.get(item) !== ''
                    ))}
                >
                    Translate
                </Button>
            </div>
            {translateResponseJson && (
                <SchemaRenderer
                    data={translateResponseJson}
                    schema={resultSchema}
                    onDataPathSelect={populateSchemaHandler}
                />
            )}
            {translateResponseText && (
                <Collapsable title="Original response">
                    {translateResponseText}
                </Collapsable>
            )}
            {loading && (
                <div className="flex flex-center">
                    <CircularProgress />
                </div>
            )}
            {error && <Alert severity="error">{error.message}</Alert>}
        </div>
    );
}
