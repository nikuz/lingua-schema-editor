import React, { useState, useCallback, useEffect } from 'react';
import {
    Outlet,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import {
    Box,
    Tabs,
    Tab,
} from '@mui/material';
import { routerConstants } from '../../constants';
import './SchemaEdit.css';

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

    const tabChangeHandler = useCallback((e: React.SyntheticEvent, index: number) => {
        navigate(tabs[index].url);
    }, [navigate]);

    useEffect(() => {
        const activeTabIndex = tabs.findIndex(item => item.url === location.pathname);
        if (activeTabIndex !== -1 && activeTabIndex !== activeTab) {
            setActiveTab(activeTabIndex);
        }
    }, [activeTab, location]);

    return <>
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
