import React, { useState, useCallback, useEffect } from 'react';
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
import { useGetLanguages, useStoreLanguages } from 'src/providers/language';
import { useAuthTokenId } from 'src/providers/firebase';
import { FormFields, LanguagesType } from 'src/types';
import './Languages.css';

const { REACT_APP_LANGUAGES_URL } = process.env;

export default function Languages() {
    const [userTokenId, userTokenLoading, userTokenIdError] = useAuthTokenId();
    const [fields, setFields] = useState<FormFields>({
        url: {
            label: 'Url',
            value: REACT_APP_LANGUAGES_URL || '',
            fullWidth: true,
        }
    });
    const [getLanguages, {
        loading: getLanguagesLoading,
        error: getLanguagesError,
        data: storedLanguages,
    }] = useGetLanguages();
    const [storeLanguages, {
        loading: storeLanguagesLoading,
        error: storeLanguagesError,
    }] = useStoreLanguages();
    const [languages, setLanguages] = useState<LanguagesType>();
    const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
    const loading = userTokenLoading || getLanguagesLoading || storeLanguagesLoading;
    const error = userTokenIdError || getLanguagesError || storeLanguagesError;

    const requestHandler = useCallback((): Promise<void> => {
        if (!userTokenId) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            languagesController.retrieve({
                url: fields.url.value,
                token: userTokenId,
            }).then(response => {
                setLanguages(response)
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }, [userTokenId, fields]);

    const saveHandler = useCallback(async () => {
        if (userTokenId && languages) {
            storeLanguages({
                token: userTokenId,
                languages,
            }).then(() => {
                setSnackbarIsOpen(true);
            });
        }
    }, [languages, userTokenId, storeLanguages]);

    const closeSnackbarHandler = useCallback(async () => {
        setSnackbarIsOpen(false);
    }, []);

    useEffect(() => {
        if (userTokenId && !storedLanguages && !getLanguagesLoading && !getLanguagesError) {
            getLanguages({ token: userTokenId });
        }
    }, [userTokenId, storedLanguages, getLanguagesLoading, getLanguagesError, getLanguages]);

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
                <CardHeader title={`New retrieved Languages (${Object.entries(languages).length})`} />
                <CardContent>
                    {Object.entries(languages).map(item => (
                        <Chip
                            key={item[0]}
                            label={item[1]}
                            className="language-chip"
                        />
                    ))}
                </CardContent>
            </Card>
        )}
        {storedLanguages && (
            <Card sx={{ mb: 3 }}>
                <CardHeader title={`Stored Languages (${Object.entries(storedLanguages).length})`} />
                <CardContent>
                    {Object.entries(storedLanguages).map(item => (
                        <Chip
                            key={item[0]}
                            label={item[1]}
                            className="language-chip"
                        />
                    ))}
                </CardContent>
            </Card>
        )}

        <Button
            variant="contained"
            disabled={!languages || !Object.values(languages).length}
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
