import React, { useState, useCallback, useEffect } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { routerConstants } from 'src/constants';
import { routerUtils } from 'src/utils';

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

    const tabChangeHandler = useCallback((e: React.SyntheticEvent, index: number) => {
        const url = routerUtils.setParams(tabs[index].url, [':version'], [params.version]);
        navigate(url);
    }, [navigate, params]);

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
                Schema "{params.version}"
            </Typography>
            <IconButton onClick={() => navigate(routerConstants.HOME)}>
                <CloseIcon color="error" />
            </IconButton>
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
            <Outlet />
        </Box>
    </>;
}
