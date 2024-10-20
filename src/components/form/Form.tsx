import React, { useCallback, useState } from 'react';
import {
    Alert,
    Button,
    FormLabel,
    MenuItem,
    Select,
    TextField,
    Box,
} from '@mui/material';
import { FormFields, LanguagesType } from 'src/types';
import Loading from '../loading';
import './Form.css';

interface Props {
    fields: FormFields,
    languages?: LanguagesType,
    onChange: React.Dispatch<React.SetStateAction<any>>,
    onSubmit: () => Promise<void>,
}

export default function Form(props: Props) {
    const {
        fields,
        languages,
        onChange,
        onSubmit,
    } = props;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();

    const fieldVariablesValidationHandler = useCallback((fieldId: string, fieldValue: string) => {
        const field = fields[fieldId];
        const variables = field.variables;
        if (!variables) {
            return;
        }
        let allVariablesIncluded = true;

        for (const item of variables) {
            if (!fieldValue.includes(item)) {
                allVariablesIncluded = false;
                break;
            }
        }

        if (
            (!allVariablesIncluded && !field.variablesError)
            || (allVariablesIncluded && field.variablesError)
        ) {
            const fieldsClone: FormFields = {
                ...fields,
                [fieldId]: {
                    ...fields[fieldId],
                    value: fieldValue,
                    variablesError: !fields[fieldId].variablesError,
                }
            };
            onChange(fieldsClone);
        }
    }, [fields, onChange]);

    const fieldValueChangeHandler = useCallback((fieldId: string, value: string) => {
        const fieldsClone: FormFields = {
            ...fields,
            [fieldId]: {
                ...fields[fieldId],
                value,
            }
        };
        onChange(fieldsClone);
    }, [fields, onChange]);

    const fieldVariableValueChangeHandler = useCallback((fieldId: string, variable: string, value: string) => {
        const fieldsClone: FormFields = {
            ...fields,
            [fieldId]: {
                ...fields[fieldId],
                variablesValues: {
                    ...fields[fieldId].variablesValues,
                    [variable]: value,
                }
            }
        };
        onChange(fieldsClone);
    }, [fields, onChange]);
    
    return <>
        {Object.keys(fields).map(fieldKey => {
            const field = fields[fieldKey];
            const variables = field.variables;
            const variablesValues = field.variablesValues;

            return <React.Fragment key={fieldKey}>
                <Box sx={{ mb: 3 }}>
                    <TextField
                        variant="outlined"
                        label={field.label}
                        size="small"
                        value={field.value}
                        fullWidth={field.fullWidth}
                        multiline={field.type === 'textarea'}
                        minRows={5}
                        helperText={
                            field.variables
                                ? `Must include ${field.variables.join(', ')} variables`
                                : undefined
                        }
                        error={field.variablesError}
                        onChange={(event) => {
                            fieldValueChangeHandler(fieldKey, event.target.value);
                            if (variables) {
                                fieldVariablesValidationHandler(fieldKey, event.target.value);
                            }
                        }}
                    />
                </Box>
                <Box sx={{ mb: variables ? 3 : 0 }}>
                    {variables?.map(variable => {
                        const isLanguageSelector = variable.toLocaleLowerCase().includes('language');
                        const value = variablesValues ? variablesValues[variable] : '';
                        return (
                            <div key={variable} className="form-element-horizontal">
                                <div>
                                    <FormLabel id={variable}>{variable} value</FormLabel>
                                </div>
                                {isLanguageSelector && (
                                    <Select
                                        value={value || ''}
                                        size="small"
                                        onChange={(event) => {
                                            fieldVariableValueChangeHandler(
                                                fieldKey,
                                                variable,
                                                event.target.value,
                                            );
                                        }}
                                    >
                                        {languages && Object.entries(languages).map(language => (
                                            <MenuItem
                                                key={language[0]}
                                                value={language[0]}
                                            >
                                                {language[1]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                                {!isLanguageSelector && (
                                    <TextField
                                        value={value || ''}
                                        variant="outlined"
                                        size="small"
                                        onChange={(event) => {
                                            fieldVariableValueChangeHandler(
                                                fieldKey,
                                                variable,
                                                event.target.value,
                                            );
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </Box>
            </React.Fragment>;
        })}
        <Box sx={{ mb: 3 }}>
            <Button
                variant="contained"
                onClick={() => {
                    setLoading(true);
                    setError(undefined);
                    onSubmit().then(() => {
                        setLoading(false);
                    }).catch(err => {
                        setLoading(false);
                        setError(err);
                    });
                }}
                // enabled if all the fields with variables have their variables populated
                // and no fields have errors
                disabled={(
                    !Object.values(fields).every(field => (
                        !field.variables || field.variables.every(variable => (
                            field.variablesValues && !!field.variablesValues[variable]
                        ))
                    ))
                    || Object.values(fields).some(field => field.variablesError)
                )}
            >
                Get
            </Button>
        </Box>
        {loading && <Loading />}
        {error && <Alert severity="error">{error.message}</Alert>}
    </>;
}