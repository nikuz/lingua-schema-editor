import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    Outlet,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';
import {
    Container,
    Box,
    Tabs,
    Tab,
    Typography,
    IconButton,
    Button,
    TextField,
    Alert,
    Snackbar,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Loading, Prompt, SaveHotkey } from 'src/components';
import { routerConstants } from 'src/constants';
import { routerUtils, schemaUtils } from 'src/utils';
import {
    useGetLanguages,
    useAuthTokenId,
    useGetSchema,
    useAddSchema,
    useUpdateSchema,
} from 'src/controllers';
import {
    SchemaEditCache,
    SetSchemaEditCacheCallback,
} from 'src/types';
// import data from 'src/data/man.json';

const tabs = [{
    label: 'Cookie Consent',
    url: routerConstants.SCHEMA_EDIT,
}, {
    label: 'Quick Translation',
    url: routerConstants.SCHEMA_EDIT_QUICK_TRANSLATION,
}, {
    label: 'Translation',
    url: routerConstants.SCHEMA_EDIT_TRANSLATION,
}, {
    label: 'Pronunciation',
    url: routerConstants.SCHEMA_EDIT_PRONUNCIATION,
}, {
    label: 'Images',
    url: routerConstants.SCHEMA_EDIT_IMAGES,
}];

export default function SchemaEdit() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [userTokenId, userTokenLoading, userTokenIdError] = useAuthTokenId();
    const [activeTab, setActiveTab] = useState(0);
    const [savingPrompt, setSavingPrompt] = useState(false);
    const [newSchemaVersionName, setNewSchemaVersionName] = useState('');
    const version = useMemo(() => params.version, [params]);
    const isNew = useMemo(() => version === 'new', [version]);
    const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
    // cache container to keep schemas and API responses states of individual tabs
    const [cache, setCache] = useState<SchemaEditCache>({
        cookie_consent: { initiated: isNew },
        quick_translation: { initiated: isNew },
        translation: { initiated: isNew },
        pronunciation: { initiated: isNew },
        images: { initiated: isNew },
    });
    const [getLanguages, {
        loading: getLanguagesLoading,
        error: getLanguagesError,
        data: storedLanguages,
    }] = useGetLanguages();
    const [getSchema, {
        loading: getSchemaLoading,
        error: getSchemaError,
        data: schemaFromCloud,
    }] = useGetSchema();
    const [addSchema, {
        loading: addSchemaLoading,
        error: addSchemaError,
    }] = useAddSchema();
    const [updateSchema, {
        loading: updateSchemaLoading,
        error: updateSchemaError,
    }] = useUpdateSchema();
    const isSaveEnabled = useMemo(() => {
        if (schemaFromCloud?.current) {
            return schemaUtils.validateIntegrity({
                cookie_consent: cache.cookie_consent.schema,
                quick_translation: cache.quick_translation.schema,
                translation: cache.translation.schema,
                pronunciation: cache.pronunciation.schema,
                images: cache.images.schema,
            });
        }
        return true;
    }, [cache, schemaFromCloud]);
    const newVersionNameError = useMemo<boolean>(() => (
        newSchemaVersionName.trim() !== '' && isNaN(Number(newSchemaVersionName))
    ), [newSchemaVersionName]);
    const loading = userTokenLoading || getLanguagesLoading || getSchemaLoading || addSchemaLoading || updateSchemaLoading;
    const error = userTokenIdError || getLanguagesError || getSchemaError || addSchemaError || updateSchemaError;

    const setCacheHandler: SetSchemaEditCacheCallback = useCallback((key, cachePart) => {
        const cacheClone = {
            ...cache,
            [key]: cachePart,
        };
        setCache(cacheClone);
    }, [cache]);

    const tabChangeHandler = useCallback((e: React.SyntheticEvent, index: number) => {
        const url = routerUtils.setParams(tabs[index].url, [':version'], [params.version]);
        navigate(url);
    }, [navigate, params]);

    const closeSnackbarHandler = useCallback(async () => {
        setSnackbarIsOpen(false);
    }, []);

    const saveResultSchema = useCallback(() => {
        if (!userTokenId) {
            return;
        }

        const schema = {
            cookie_consent: cache.cookie_consent.schema,
            quick_translation: cache.quick_translation.schema,
            translation: cache.translation.schema,
            pronunciation: cache.pronunciation.schema,
            images: cache.images.schema,
        };

        if (isNew) {
            addSchema({
                schema: {
                    version: newSchemaVersionName,
                    schema,
                    current: false,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                },
                token: userTokenId,
            }).then(() => {
                setSnackbarIsOpen(true);
            });
        } else if (version && schemaFromCloud) {
            updateSchema({
                id: version,
                schema: {
                    ...schemaFromCloud,
                    schema,
                    updatedAt: Date.now(),
                },
                token: userTokenId,
            }).then(() => {
                setSnackbarIsOpen(true);
            });
        }
    }, [userTokenId, cache, newSchemaVersionName, isNew, version, schemaFromCloud, addSchema, updateSchema]);

    const saveButtonClickHandler = useCallback(() => {
        if (!isSaveEnabled || error) {
            return;
        }
        if (isNew) {
            setSavingPrompt(true);
        } else {
            saveResultSchema();
        }
    }, [isNew, isSaveEnabled, error, saveResultSchema]);

    useEffect(() => {
        const activeTabIndex = tabs.findIndex(item => {
            const url = routerUtils.setParams(item.url, [':version'], [params.version]);
            return url === location.pathname;
        });
        if (activeTabIndex !== -1 && activeTabIndex !== activeTab) {
            setActiveTab(activeTabIndex);
        }
    }, [activeTab, location, params]);

    useEffect(() => {
        if (userTokenId && !storedLanguages && !getLanguagesLoading && !getLanguagesError) {
            getLanguages({ token: userTokenId });
        }
    }, [userTokenId, storedLanguages, getLanguagesLoading, getLanguagesError, getLanguages]);

    useEffect(() => {
        if (userTokenId && !isNew && version && !schemaFromCloud && !getSchemaLoading && !getSchemaError) {
            getSchema({
                token: userTokenId,
                id: version,
            });
        }
    }, [userTokenId, isNew, version, schemaFromCloud, getSchemaLoading, getSchemaError, getSchema]);

    useEffect(() => {
        if (schemaFromCloud) {
            let schema = schemaFromCloud.schema;
            if (schema) {
                setCache({
                    cookie_consent: {
                        initiated: false,
                        schema: schema.cookie_consent,
                    },
                    quick_translation: {
                        initiated: false,
                        schema: schema.quick_translation,
                    },
                    translation: {
                        initiated: false,
                        schema: schema.translation,
                    },
                    pronunciation: {
                        initiated: false,
                        schema: schema.pronunciation,
                    },
                    images: {
                        initiated: false,
                        schema: schema.images,
                    },
                });
            }
        }
    }, [schemaFromCloud]);

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        onClick={() => navigate(routerConstants.HOME)}
                        sx={{ mr: 1 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6">
                        {isNew ? 'New schema' : `Schema "${params.version}"`}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    color="success"
                    disabled={!isSaveEnabled || !!error}
                    onClick={saveButtonClickHandler}
                >
                    <SaveIcon sx={{ mr: 1 }} />
                    Save
                </Button>
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={activeTab}
                    variant="fullWidth"
                    onChange={tabChangeHandler}
                >
                    {tabs.map((item, key) => (
                        <Tab key={key} label={item.label} />
                    ))}
                </Tabs>
            </Box>
            <Box sx={{ pt: 3 }}>
                <Outlet
                    context={[
                        cache,
                        setCacheHandler,
                        storedLanguages,
                    ]}
                />
            </Box>
            {savingPrompt && (
                <Prompt
                    isOpen
                    title={`Make a name for new schema`}
                    onCancel={() => {
                        setSavingPrompt(false);
                    }}
                    disabled={newSchemaVersionName.trim() === '' || newVersionNameError}
                    onConfirm={() => {
                        setSavingPrompt(false);
                        saveResultSchema();
                    }}
                >
                    <TextField
                        variant="outlined"
                        label="Name"
                        size="small"
                        value={newSchemaVersionName}
                        sx={{ mt: 1 }}
                        fullWidth
                        error={newVersionNameError}
                        helperText="Has to be unique number"
                        autoFocus
                        onChange={(event) => {
                            setNewSchemaVersionName(event.target.value);
                        }}
                    />
                </Prompt>
            )}
            <SaveHotkey
                onSave={saveButtonClickHandler}
            />
            <Snackbar
                open={snackbarIsOpen}
                autoHideDuration={3000}
                onClose={closeSnackbarHandler}
            >
                <Alert onClose={closeSnackbarHandler} severity="success" sx={{ width: '100%' }}>
                    Schema is saved
                </Alert>
            </Snackbar>
            {loading && <Loading blocker fixed />}
            {error && (
                <Alert severity="error" sx={{ mt: '3' }}>{error.message}</Alert>
            )}
        </Container>
    );
}
