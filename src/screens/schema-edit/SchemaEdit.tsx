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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { routerConstants } from 'src/constants';
import { routerUtils } from 'src/utils';
import {
    ResultSchemaType,
    ResultSchemaKeys,
    SetResultSchemaCallback,
} from '../../types';

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

export default function SchemaEdit() {
    const [activeTab, setActiveTab] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const isNew = params.version === 'new';
    const [resultSchema, setResultSchema] = useState<ResultSchemaType>({});
    const isSaveEnabled = useMemo(() => {
        let schemaIsValid = true;
        const currentSchemaKeys = Object.keys(resultSchema);
        const resultSchemaKeys = Object.keys(ResultSchemaKeys);
        for (let key of resultSchemaKeys) {
            if (!currentSchemaKeys.includes(key)) {
                schemaIsValid = false;
                break;
            }
        }
        return schemaIsValid;
    }, [resultSchema]);

    const setSchemaHandler: SetResultSchemaCallback = useCallback((key, schema) => {
        const schemaClone = {
            ...resultSchema,
            [key]: schema,
        };
        setResultSchema(schemaClone);
    }, [resultSchema]);

    const tabChangeHandler = useCallback((e: React.SyntheticEvent, index: number) => {
        const url = routerUtils.setParams(tabs[index].url, [':version'], [params.version]);
        navigate(url);
    }, [navigate, params]);

    const saveResultSchema = useCallback(() => {
        if (Object.values(resultSchema).length > 0) {

        }
    }, [resultSchema]);

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
                disabled={!isSaveEnabled}
                onClick={saveResultSchema}
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
            <Outlet context={setSchemaHandler} />
        </Box>
    </>;
}
