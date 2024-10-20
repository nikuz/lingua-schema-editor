import { useState, useCallback, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    TextField,
    Button,
    Alert,
} from '@mui/material';
import { Loading } from 'src/components';
import {
    authInstance,
    useAuthState,
    signInWithEmailAndPassword,
} from 'src/controllers';
import { routerConstants } from 'src/constants';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [user, authLoading, authError] = useAuthState();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<Error>();
    const loading = authLoading || loginLoading;
    const error = authError || loginError;

    const loginHandler = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginLoading(true);
        setLoginError(undefined);
        signInWithEmailAndPassword(authInstance, email, password).then(() => {
            setLoginLoading(false);
        }).catch(err => {
            setLoginLoading(false);
            setLoginError(err);
        });
    }, [email, password]);

    useEffect(() => {
        if (!loading && user) {
            navigate(routerConstants.HOME);
        }
    }, [loading, user, navigate]);

    return (
        <div className="flex flex-center">
            <form className="login-container" action="#" onSubmit={loginHandler}>
                <div>
                    <Typography variant="h4" component="h1">
                        <b>Welcome!</b>
                    </Typography>
                    <Typography variant="body2">Sign in to continue.</Typography>
                </div>
                <Box sx={{ mt: 3, mb: 3 }}>
                    <TextField
                        variant="outlined"
                        id="email"
                        label="Email"
                        size="small"
                        value={email}
                        fullWidth
                        disabled={loading}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                </Box>
                <Box sx={{ mt: 3, mb: 3 }}>
                    <TextField
                        variant="outlined"
                        id="password"
                        label="Password"
                        size="small"
                        type="password"
                        value={password}
                        fullWidth
                        disabled={loading}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                </Box>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>{error.message}</Alert>
                )}
                <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    onClick={() => {

                    }}
                    disabled={loading || email === '' || password === ''}
                >
                    Login
                </Button>
                {loading && <Loading blocker fixed />}
            </form>
        </div>
    );
}