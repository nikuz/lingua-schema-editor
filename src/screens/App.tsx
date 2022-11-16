import React, { useState, useCallback, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormLabel from '@mui/material/FormLabel';
import { translateController } from '../controllers';
import { localStorageProvider } from '../providers';
import supportedLanguages from './supported-languages.json';
import './App.css';

const {
    REACT_APP_TRANSLATION_URL,
    REACT_APP_TRANSLATION_MARKER,
    REACT_APP_TRANSLATION_BODY_PARAMETER,
    REACT_APP_TRANSLATION_BODY,
} = process.env;

const bodyParameterMandatoryVariables = ['{marker}', '{word}', '{sourceLanguage}', '{targetLanguage}'];

function App() {
    const [url, setUrl] = useState<string>('');
    const [bodyParameterName, setBodyParameterName] = useState<string>('');
    const [bodyParameterValue, setBodyParameterValue] = useState<string>('');
    const [bodyParameterValidationError, setBodyParameterValidationError] = useState(false);
    const [variablesValues, setVariablesValues] = useState<Map<string, string>>(new Map());
    const [translateResponse, setTranslateResponse] = useState('');

    const requestHandler = useCallback(async () => {
        let body = bodyParameterValue;
        variablesValues.forEach((value, key) => {
            body = body.replace(key, value);
        });

        const response = await translateController.translate({
            url,
            body: {
                [bodyParameterName]: body,
            },
        });

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
            if (translationResult !== '') {
                setTranslateResponse(JSON.stringify(JSON.parse(JSON.parse(translationResult)[0][2]), null, 4));
            }
        }
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
            <pre>
                {translateResponse}
            </pre>
        </div>
    );
}

export default App;
