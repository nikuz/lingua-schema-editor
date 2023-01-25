import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cl from 'classnames';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Alert,
    Typography,
    Box,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
    Loading,
    Prompt,
} from 'src/components';
import {
    firestoreInstance,
    firestoreCollection,
    firestoreDoc,
    firestoreSetDoc,
    firestoreQuery,
    firestoreWhere,
    firestoreGetDoc,
    firestoreGetDocs,
    firestoreDeleteDoc,
    useAuthTokenId,
} from 'src/providers/firebase';
import { useGetSchemaList } from 'src/providers/schema';
import { routerConstants } from 'src/constants';
import { routerUtils } from 'src/utils';
import './Dashboard.css';

export default function Dashboard() {
    const [userTokenId, userTokenLoading, userTokenIdError] = useAuthTokenId();
    const navigate = useNavigate();
    const [getSchemasList, {
        loading: getSchemasListLoading,
        error: getSchemasListError,
        data: schemasList,
    }] = useGetSchemaList();
    const [changeCurrentPrompt, setChangeCurrentPrompt] = useState<string>();
    const [changeCurrentPromptLoading, setChangeCurrentPromptLoading] = useState(false);
    const [changeCurrentPromptError, setChangeCurrentPromptError] = useState<Error>();
    const [removePrompt, setRemovePrompt] = useState<string>();
    const [removePromptLoading, setRemovePromptLoading] = useState(false);
    const [removePromptError, setRemovePromptErrorError] = useState<Error>();
    const loading = userTokenLoading || getSchemasListLoading || changeCurrentPromptLoading || removePromptLoading;
    const error = userTokenIdError || getSchemasListError || changeCurrentPromptError || removePromptError;

    const changeCurrentHandler = useCallback(async () => {
        if (changeCurrentPrompt) {
            setChangeCurrentPromptLoading(true);
            setChangeCurrentPromptError(undefined);

            const schemas = firestoreCollection(firestoreInstance, 'schemas');
            const activeCurrentDocRef = firestoreQuery(schemas, firestoreWhere('current', '==', true));
            if (activeCurrentDocRef) {
                const activeCurrentDocs = await firestoreGetDocs(activeCurrentDocRef);
                activeCurrentDocs.forEach(item => {
                    firestoreSetDoc(item.ref, { current: false }, { merge: true });
                });
            }

            const docReference = firestoreDoc(firestoreInstance, 'schemas', changeCurrentPrompt);
            firestoreSetDoc(
                docReference,
                { current: true },
                { merge: true }
            )
                .then(() => {
                    setChangeCurrentPromptLoading(false);
                    firestoreGetDoc(docReference).then(response => {
                        firestoreSetDoc(
                            firestoreDoc(firestoreInstance, 'schemas', 'current'),
                            {
                                ...response.data(),
                                id: 'current',
                            }
                        );
                    });
                })
                .catch(err => {
                    setChangeCurrentPromptLoading(false);
                    setChangeCurrentPromptError(err);
                });
        }
        setChangeCurrentPrompt(undefined);
    }, [changeCurrentPrompt]);

    const removeSchemaHandler = useCallback(async () => {
        if (removePrompt) {
            setRemovePromptLoading(true);
            setRemovePromptErrorError(undefined);
            const docReference = firestoreDoc(firestoreInstance, 'schemas', removePrompt);
            if (docReference) {
                firestoreDeleteDoc(docReference).then(() => {
                    setRemovePromptLoading(false);
                }).catch(err => {
                    setRemovePromptLoading(false);
                    setRemovePromptErrorError(err);
                });
            }
        }
        setRemovePrompt(undefined);
    }, [removePrompt]);

    const getSchemaEditUrl = useCallback((value: string) => {
        return routerUtils.setParams(routerConstants.SCHEMA_EDIT, [':version'], [value]);
    }, []);

    useEffect(() => {
        if (userTokenId && !schemasList && !getSchemasListLoading && !getSchemasListError) {
            getSchemasList({
                token: userTokenId,
            });
        }
    }, [userTokenId, getSchemasListLoading, getSchemasListError, schemasList, getSchemasList]);

    return <>
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Current</TableCell>
                        <TableCell>Version</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated At</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {schemasList?.map((item, key) => {
                        if (item.id === 'current') {
                            return null;
                        }
                        const createdAt = item.createdAt && new Date(item.createdAt);
                        const updatedAt = item.updatedAt && new Date(item.updatedAt);

                        return (
                            <TableRow key={key}>
                                <TableCell sx={{ pl: 3 }}>
                                    {item.current && <StarIcon color="warning" />}
                                </TableCell>
                                <TableCell>
                                    {item.version}
                                </TableCell>
                                <TableCell>{createdAt && `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`}</TableCell>
                                <TableCell>{updatedAt && `${updatedAt.toLocaleDateString()} ${updatedAt.toLocaleTimeString()}`}</TableCell>
                                <TableCell sx={{ width: 190 }}>
                                    <IconButton
                                        className="dashboard-action-btn"
                                        onClick={() => navigate(getSchemaEditUrl(item.version))}
                                    >
                                        <CreateIcon color="primary" />
                                    </IconButton>
                                    <IconButton
                                        className={cl('dashboard-action-btn', { disabled: item.current })}
                                        disabled={item.current}
                                        onClick={() => setChangeCurrentPrompt(item.version)}
                                    >
                                        <StarHalfIcon color={item.current ? 'inherit' : 'primary'} />
                                    </IconButton>
                                    <IconButton
                                        className={cl('dashboard-action-btn', { disabled: item.current })}
                                        disabled={item.current}
                                        onClick={() => setRemovePrompt(item.version)}
                                    >
                                        <DeleteIcon color={item.current ? 'inherit' : 'error'} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        {error && (
            <Alert sx={{ mt: 3 }} severity="error">{error.message}</Alert>
        )}
        <Button
            variant="contained"
            color="success"
            sx={{ mt: 3 }}
            onClick={() => navigate(getSchemaEditUrl('new'))}
        >
            <AddIcon />
            Add
        </Button>
        {schemasList && schemasList.length === 0 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2">No schemas found</Typography>
            </Box>
        )}
        {changeCurrentPrompt && (
            <Prompt
                isOpen
                title={`Change current schema to "${changeCurrentPrompt}"?`}
                onCancel={() => {
                    setChangeCurrentPrompt(undefined);
                }}
                onConfirm={changeCurrentHandler}
            />
        )}
        {removePrompt && (
            <Prompt
                isOpen
                title={`Remove schema "${removePrompt}"?`}
                onCancel={() => {
                    setRemovePrompt(undefined);
                }}
                onConfirm={removeSchemaHandler}
            />
        )}
        {loading && <Loading blocker fixed />}
    </>
}
