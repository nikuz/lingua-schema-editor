import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Button,
    CircularProgress,
    FormLabel,
    MenuItem,
    Select,
    TextField,
    Box,
} from '@mui/material';
import { translateController } from '../../controllers';
import { jsonUtils } from '../../utils';
import supportedLanguages from '../../data/supported-languages.json';
import './TranslateForm.css';
// import data from '../../data/man.json';

interface Props {
    url: string,
    marker: string,
    parameter: string,
    body: string,
    bodyVariables: string[],
    onDataReceive: (originalResponse: string, data: any) => void,
}

export default function TranslateForm(props: Props) {
    const {
        bodyVariables,
        onDataReceive,
    } = props;
    const [url, setUrl] = useState<string>(props.url);
    const [marker, setMarker] = useState<string>(props.marker);
    const [parameter, setParameter] = useState<string>(props.parameter);
    const [body, setBody] = useState<string>(props.body);
    const [bodyValidationError, setBodyValidationError] = useState(false);
    const [bodyVariablesValues, setBodyVariablesValues] = useState<Map<string, string>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();

    const requestHandler = useCallback(() => {
        setLoading(true);
        let bodyValue = body.replace('{marker}', marker);
        bodyVariablesValues.forEach((value, key) => {
            bodyValue = bodyValue.replace(key, value);
        });

        translateController.translate({
            url,
            body: {
                [parameter]: bodyValue,
            },
        }).then(response => {
            setLoading(false);
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
                            onDataReceive(translationResult, JSON.parse(allJsonStrings[0]));
                            if (error) {
                                setError(undefined);
                            }
                        } else {
                            setError(new Error('No JSON strings in the response'));
                        }
                    } catch (e) {
                        setError(new Error('Can\'t parse response JSON'));
                    }
                }
            }
        }).catch(err => {
            setLoading(false);
            setError(err);
        });
    }, [url, marker, parameter, body, bodyVariablesValues, error, onDataReceive]);

    const bodyValidationHandler = useCallback((value: string) => {
        let allVariablesIncluded = true;

        for (const item of bodyVariables) {
            if (!value.includes(item)) {
                allVariablesIncluded = false;
                break;
            }
        }

        if (!allVariablesIncluded && !bodyValidationError) {
            setBodyValidationError(true);
        } else if (allVariablesIncluded && bodyValidationError) {
            setBodyValidationError(false);
        }
    }, [bodyVariables, bodyValidationError]);

    const variablesValuesChangeHandler = useCallback((id: string, value: string) => {
        const variablesValuesClone = new Map(bodyVariablesValues);
        variablesValuesClone.set(id, value);
        setBodyVariablesValues(variablesValuesClone);
    }, [bodyVariablesValues]);

    useEffect(() => {
        bodyValidationHandler(body);
    }, [body, bodyValidationHandler]);

    // TODO: remove in production
    // useEffect(() => {
    //     onDataReceive(JSON.stringify(data), data);
    // }, [onDataReceive]);
    //

    return <>
        <Box sx={{ mb: 3 }}>
            <TextField
                variant="outlined"
                label="Url"
                size="small"
                value={url}
                fullWidth
                onChange={(event) => {
                    setUrl(event.target.value);
                }}
            />
        </Box>
        <Box sx={{ mb: 3 }}>
            <TextField
                variant="outlined"
                label="Body parameter name"
                size="small"
                value={parameter}
                onChange={(event) => {
                    setParameter(event.target.value);
                }}
            />
        </Box>
        <Box sx={{ mb: 3 }}>
            <TextField
                variant="outlined"
                label="Body parameter value"
                size="small"
                multiline
                minRows={5}
                fullWidth
                value={body}
                error={bodyValidationError}
                helperText={`Must include {marker}, ${bodyVariables.join(', ')} variables`}
                onChange={(event) => {
                    setBody(event.target.value);
                }}
            />
        </Box>
        <Box sx={{ mb: 3 }}>
            <div className="form-element-horizontal">
                <div>
                    <FormLabel>{`{marker}`} value</FormLabel>
                </div>
                <TextField
                    value={marker}
                    variant="outlined"
                    size="small"
                    onChange={(event) => {
                        setMarker(event.target.value)
                    }}
                />
            </div>
            {bodyVariables.map(item => {
                const isLanguageSelector = item.toLocaleLowerCase().includes('language');
                return (
                    <div key={item} className="form-element-horizontal">
                        <div>
                            <FormLabel id={item}>{item} value</FormLabel>
                        </div>
                        {isLanguageSelector && (
                            <Select
                                value={bodyVariablesValues.get(item) || ''}
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
                                value={bodyVariablesValues.get(item) || ''}
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
        </Box>
        <Box sx={{ mb: 3 }}>
            <Button
                variant="contained"
                onClick={requestHandler}
                disabled={!bodyVariables.every(item => (
                    bodyVariablesValues.has(item)
                    && bodyVariablesValues.get(item) !== ''
                    && marker !== ''
                ))}
            >
                Translate
            </Button>
        </Box>
        {loading && (
            <div className="flex flex-center">
                <CircularProgress/>
            </div>
        )}
        {error && <Alert severity="error">{error.message}</Alert>}
    </>;
}