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
import GTranslateIcon from '@mui/icons-material/GTranslate';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LogoutIcon from '@mui/icons-material/Logout';
import { Loading } from 'src/components';
import { routerUtils } from 'src/utils';
import { routerConstants } from 'src/constants';
import {
    useAuthState,
    authInstance,
    signOut,
} from 'src/providers/firebase';
import './App.css';

const DRAWER_WIDTH = 64;

const menuItems = [{
    url: routerConstants.HOME,
    label: 'Schemas',
    isSelected: (pathName: string) => (
        pathName === routerConstants.HOME
        || pathName.startsWith(routerUtils.setParams(routerConstants.SCHEMA_EDIT, [':version'], ['']))
    ),
    icon: <AccountTreeIcon />
}, {
    url: routerConstants.LANGUAGES,
    label: 'Languages',
    isSelected: (pathName: string) => (
        pathName === routerConstants.LANGUAGES
    ),
    icon: <GTranslateIcon />
}, {
    url: 'logout',
    label: 'Logout',
    subpages: [],
    isSelected: () => false,
    icon: <LogoutIcon />
}];

export default function App() {
    const [user, loading] = useAuthState();
    const location = useLocation();
    const navigate = useNavigate();
    const onLoginPage = useMemo(() => (
        location.pathname === routerConstants.LOGIN
    ), [location]);
    const onPrivacyPolicyPage = useMemo(() => (
        location.pathname === routerConstants.PRIVACY_POLICY
    ), [location]);

    useEffect(() => {
        if (!onLoginPage && !onPrivacyPolicyPage && !loading && !user) {
            navigate(routerConstants.LOGIN)
        }
    }, [loading, user, onLoginPage, onPrivacyPolicyPage, navigate]);

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
                            const isSelected = item.isSelected(location.pathname);
                            return (
                                <ListItem key={key} disablePadding sx={{ mb: 1 }}>
                                    <ListItemButton
                                        title={item.label}
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
            {(user || onLoginPage || onPrivacyPolicyPage) && (
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
