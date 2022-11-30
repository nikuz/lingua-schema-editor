import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    Outlet,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    IconButton,
    Button,
    TextField,
    Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Loading, Prompt, SaveHotkey } from '../../components';
import { routerConstants } from 'src/constants';
import { routerUtils } from 'src/utils';
import {
    firestoreInstance,
    firestoreDoc,
    firestoreGetDoc,
    firestoreSetDoc,
} from 'src/providers/firebase/controller';
import { ResultSchemaType } from 'src/types';
import { validateSchemaIntegrity } from './utils/schema-validator';
import {
    SchemaEditCache,
    SetSchemaEditCacheCallback,
} from './types';
// import data from 'src/data/bitch.json';

const tabs = [{
    label: 'Translation',
    url: routerConstants.SCHEMA_EDIT,
}, {
    label: 'Pronunciation',
    url: routerConstants.SCHEMA_EDIT_PRONUNCIATION,
}, {
    label: 'Images',
    url: routerConstants.SCHEMA_EDIT_IMAGES,
}];
const newSchemaNameMaxLength = 20;

export default function SchemaEdit() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [activeTab, setActiveTab] = useState(0);
    const [savingPrompt, setSavingPrompt] = useState(false);
    const [newSchemaVersionName, setNewSchemaVersionName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();
    const [schemaFromCloud, setSchemaFromCloud] = useState<ResultSchemaType>();
    const isNew = useMemo(() => params.version === 'new', [params]);
    // cache container to keep schemas and API responses states of individual tabs
    const [cache, setCache] = useState<SchemaEditCache>({
        translation: { initiated: isNew },
        pronunciation: { initiated: isNew },
        images: { initiated: isNew },
    });
    const isSaveEnabled = useMemo(() => {
        return validateSchemaIntegrity({
            translation: cache.translation.schema,
            pronunciation: cache.pronunciation.schema,
            images: cache.images.schema,
        });
    }, [cache]);
    const newVersionNameError = useMemo(() => (
        newSchemaVersionName.trim().toLocaleLowerCase() === 'new'
    ), [newSchemaVersionName]);

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

    const saveResultSchema = useCallback(() => {
        setLoading(true);
        setError(undefined);
        const schema = JSON.stringify({
            translation: cache.translation.schema,
            pronunciation: cache.pronunciation.schema,
            images: cache.images.schema,
        });

        if (isNew) {
            const newSchemaReference = firestoreDoc(firestoreInstance, 'schemas', newSchemaVersionName);
            firestoreGetDoc(newSchemaReference).then(result => {
                if (result.exists()) {
                    setLoading(false);
                    setError(new Error('Schema with this version name already exists. Please make unique name'));
                } else {
                    firestoreSetDoc(
                        firestoreDoc(firestoreInstance, 'schemas', newSchemaVersionName),
                        {
                            version: newSchemaVersionName,
                            schema,
                            current: false,
                            createdAt: Date.now(),
                        }
                    ).then(() => {
                        navigate(routerConstants.HOME);
                    }).catch(err => {
                        setLoading(false);
                        setError(err);
                    });
                }
            }).catch(err => {
                setLoading(false);
                setError(err);
            });
        } else if (params.version) {
            const existingSchemaReference = firestoreDoc(firestoreInstance, 'schemas', params.version);
            firestoreSetDoc(
                existingSchemaReference,
                {
                    schema,
                    updatedAt: Date.now(),
                },
                { merge: true }
            ).then(() => {
                navigate(routerConstants.HOME);
                // update current schema also
                firestoreGetDoc(existingSchemaReference).then(result => {
                    const docData = result.data();
                    if (docData && docData.current === true) {
                        firestoreSetDoc(
                            firestoreDoc(firestoreInstance, 'schemas', 'current'),
                            {
                                schema,
                                updatedAt: Date.now(),
                            },
                            { merge: true }
                        );
                    }
                });
            }).catch(err => {
                setLoading(false);
                setError(err);
            });
        }
    }, [cache, newSchemaVersionName, isNew, params, navigate]);

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
        if (!isNew && params.version && !schemaFromCloud && !loading && !error) {
            setLoading(true);
            const schemaReference = firestoreDoc(firestoreInstance, 'schemas', params.version);
            firestoreGetDoc(schemaReference).then(result => {
                setLoading(false);
                const docData = result.data();
                if (docData) {
                    let schema: ResultSchemaType | undefined;
                    try {
                        schema = JSON.parse(docData.schema);
                    } catch (e) {
                        setError(new Error('Can\'t parse schema from cloud'));
                    }
                    if (schema) {
                        setSchemaFromCloud(schema);
                        setCache({
                            translation: {
                                initiated: false,
                                schema: schema.translation,
                                // responseJson: data,
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
                } else {
                    setError(new Error('Can\'t find document in cloud'));
                }
            }).catch(err => {
                setLoading(false);
                setError(err);
            });
        }
    }, [params, isNew, loading, error, schemaFromCloud]);

    useEffect(() => {
        const activeTabIndex = tabs.findIndex(item => {
            const url = routerUtils.setParams(item.url, [':version'], [params.version]);
            return url === location.pathname;
        });
        if (activeTabIndex !== -1 && activeTabIndex !== activeTab) {
            setActiveTab(activeTabIndex);
        }
    }, [activeTab, location, params]);

    return <>
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
                variant="outlined"
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
                    setCacheHandler
                ]}
            />
        </Box>
        {savingPrompt && (
            <Prompt
                isOpen
                title={`Make a version name for new schema`}
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
                    helperText={`Has to be unique. Cannot be "new". 20 characters max.`}
                    autoFocus
                    onChange={(event) => {
                        setNewSchemaVersionName(event.target.value.substring(0, newSchemaNameMaxLength));
                    }}
                />
            </Prompt>
        )}
        <SaveHotkey
            onSave={saveButtonClickHandler}
        />
        {loading && <Loading blocker />}
        {error && (
            <Alert severity="error">{error.message}</Alert>
        )}
    </>;
}
