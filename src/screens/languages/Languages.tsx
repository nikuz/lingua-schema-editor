import React, { useState, useCallback } from 'react';
import {
    Alert,
    Chip,
    Typography,
    Card,
    CardHeader,
    CardContent,
    Button,
    Snackbar,
} from '@mui/material';
import {
    Form,
    Loading,
} from 'src/components';
import { languagesController } from 'src/controllers';
import {
    firestoreInstance,
    firestoreDoc,
    firestoreSetDoc,
} from 'src/providers/firebase';
import { useStoredLanguages } from 'src/hooks';
import { FormFields, Language } from 'src/types';
import './Languages.css';

const { REACT_APP_LANGUAGES_URL } = process.env;

export default function Languages() {
    const [fields, setFields] = useState<FormFields>({
        url: {
            label: 'Url',
            value: REACT_APP_LANGUAGES_URL || '',
            fullWidth: true,
        }
    });
    const [languages, setLanguages] = useState<Language[]>();
    const [storedLanguages, storedLanguagesLoading, storedLanguagesError] = useStoredLanguages();
    const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState<Error | undefined>();
    const loading = storedLanguagesLoading || saveLoading;
    const error = storedLanguagesError || saveError;

    const requestHandler = useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {
            languagesController.retrieve(fields.url.value).then(response => {
                console.log(response);
                setLanguages(response)
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }, [fields]);

    const saveHandler = useCallback(async () => {
        setSaveLoading(true);
        const docReference = firestoreDoc(firestoreInstance, 'languages', 'languages');
        firestoreSetDoc(docReference, { raw: JSON.stringify(languages) }).then(() => {
            setSaveLoading(false);
            setSnackbarIsOpen(true);
        }).catch(err => {
            setSaveError(err);
        });
    }, [languages]);

    const closeSnackbarHandler = useCallback(async () => {
        setSnackbarIsOpen(false);
    }, []);

    return <>
        <Typography variant="h4" sx={{ mb: 3 }}>
            Supported languages
        </Typography>
        <Form
            fields={fields}
            onChange={setFields}
            onSubmit={requestHandler}
        />
        {languages && (
            <Card sx={{ mb: 3 }}>
                <CardHeader title={`New retrieved Languages (${languages.length})`} />
                <CardContent>
                    {languages.map(item => (
                        <Chip
                            key={item.id}
                            label={item.value}
                            className="language-chip"
                        />
                    ))}
                </CardContent>
            </Card>
        )}
        {storedLanguages && (
            <Card sx={{ mb: 3 }}>
                <CardHeader title={`Stored Languages (${storedLanguages.length})`} />
                <CardContent>
                    {storedLanguages.map(item => (
                        <Chip
                            key={item.id}
                            label={item.value}
                            className="language-chip"
                        />
                    ))}
                </CardContent>
            </Card>
        )}

        <Button
            variant="contained"
            disabled={!languages?.length}
            onClick={saveHandler}
        >
            Save
        </Button>

        <Snackbar
            open={snackbarIsOpen}
            autoHideDuration={3000}
            onClose={closeSnackbarHandler}
        >
            <Alert onClose={closeSnackbarHandler} severity="success" sx={{ width: '100%' }}>
                Languages are saved
            </Alert>
        </Snackbar>

        {loading && <Loading blocker fixed />}
        {error && (
            <Alert severity="error">{error.message}</Alert>
        )}
    </>
}
