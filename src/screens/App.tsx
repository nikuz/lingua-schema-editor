import React from 'react';
import {
    Outlet,
    useNavigate,
    useLocation,
} from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Box,
    CssBaseline,
} from '@mui/material';
import SchemaIcon from '@mui/icons-material/Schema';
import SaveIcon from '@mui/icons-material/Save';
import { routerConstants } from '../constants';
import './App.css';

const DRAWER_WIDTH = 64;

const menuItems = [{
    url: routerConstants.SCHEMA_EDIT,
    icon: <SchemaIcon />
}, {
    url: routerConstants.SAVED_SCHEMAS,
    icon: <SaveIcon />
}];

export default function App() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <List>
                    {menuItems.map((item, key) => {
                        const isSelected = location.pathname.indexOf(item.url) === 0;
                        return (
                            <ListItem key={key} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        px: 2.5,
                                    }}
                                    selected={isSelected}
                                    onClick={() => navigate(item.url)}
                                >
                                    <ListItemIcon sx={{ minWidth: 0 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}
