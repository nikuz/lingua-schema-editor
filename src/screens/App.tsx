import React, { useEffect, useMemo } from 'react';
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
import LogoutIcon from '@mui/icons-material/Logout';
import { Loading } from 'src/components';
import { routerConstants } from 'src/constants';
import {
    useAuthState,
    authInstance,
    signOut,
} from 'src/providers/firebase';
import './App.css';

const DRAWER_WIDTH = 64;

const menuItems = [{
    url: routerConstants.SCHEMA_LIST,
    icon: <SchemaIcon />
}, {
    url: 'logout',
    icon: <LogoutIcon />
}];

export default function App() {
    const [user, loading] = useAuthState(authInstance);
    const location = useLocation();
    const navigate = useNavigate();
    const onLoginPage = useMemo(() => (
        location.pathname === routerConstants.LOGIN
    ), [location]);

    useEffect(() => {
        if (!onLoginPage && !loading && !user) {
            navigate(routerConstants.LOGIN)
        }
    }, [loading, user, onLoginPage, navigate]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {user && (
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
                            const isSelected = location.pathname === item.url;
                            return (
                                <ListItem key={key} disablePadding sx={{ mb: 1 }}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            px: 2.5,
                                        }}
                                        selected={isSelected}
                                        onClick={() => {
                                            if (item.url === 'logout') {
                                                signOut(authInstance);
                                            } else {
                                                navigate(item.url);
                                            }
                                        }}
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
            )}
            {(user || onLoginPage) && (
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.default',
                        p: 3,
                        overflow: 'hidden',
                    }}
                >
                    <Outlet />
                </Box>
            )}
            {!onLoginPage && loading && (
                <Loading blocker />
            )}
        </Box>
    )
}
