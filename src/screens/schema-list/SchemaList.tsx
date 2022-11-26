import React, { useState, useCallback } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Alert,
    Typography,
    Box,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Loading,
    Prompt,
} from 'src/components';
import {
    firestoreInstance,
    firestoreCollection,
    useFirestoreCollectionData,
    firestoreDoc,
    setFirestoreDoc,
    firestoreQuery,
    firestoreWhere,
    firestoreGetDocs,
    firestoreDeleteDoc,
} from 'src/providers/firebase';

export default function SchemaList() {
    const [values, listRetrievalLoading, listRetrievalError] = useFirestoreCollectionData(
        firestoreCollection(firestoreInstance, 'schemas')
    );
    const [changeCurrentPrompt, setChangeCurrentPrompt] = useState<string>();
    const [changeCurrentPromptLoading, setChangeCurrentPromptLoading] = useState(false);
    const [changeCurrentPromptError, setChangeCurrentPromptError] = useState<Error>();
    const [removePrompt, setRemovePrompt] = useState<string>();
    const [removePromptLoading, setRemovePromptLoading] = useState(false);
    const [removePromptError, setRemovePromptErrorError] = useState<Error>();
    const loading = listRetrievalLoading || changeCurrentPromptLoading || removePromptLoading;
    const error = listRetrievalError || changeCurrentPromptError || removePromptError;

    const changeCurrentHandler = useCallback(async () => {
        if (changeCurrentPrompt) {
            setChangeCurrentPromptLoading(true);
            setChangeCurrentPromptError(undefined);

            const schemas = firestoreCollection(firestoreInstance, 'schemas');
            const activeCurrentDocRef = firestoreQuery(schemas, firestoreWhere('current', '==', true));
            if (activeCurrentDocRef) {
                const activeCurrentDocs = await firestoreGetDocs(activeCurrentDocRef);
                activeCurrentDocs.forEach(item => {
                    setFirestoreDoc(item.ref, { current: false }, { merge: true });
                });
            }

            const docReference = firestoreDoc(firestoreInstance, 'schemas', changeCurrentPrompt);
            setFirestoreDoc(
                docReference,
                { current: true },
                { merge: true }
            )
                .then(() => {
                    setChangeCurrentPromptLoading(false);
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
                    {values?.map((item, key) => {
                        const createdAt = item.createdAt && new Date(item.createdAt.seconds * 1000);
                        const updatedAt = item.updatedAt && new Date(item.updatedAt.seconds * 1000);

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
                                <TableCell sx={{ width: 170 }}>
                                    <IconButton>
                                        <CreateIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => setChangeCurrentPrompt(item.version)}>
                                        <StarHalfIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => setRemovePrompt(item.version)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        {values?.length === 0 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2">No schemas found</Typography>
            </Box>
        )}
        {error && (
            <Alert severity="error">{error.message}</Alert>
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
        {loading && <Loading blocker />}
    </>
}
