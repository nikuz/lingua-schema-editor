import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { authInstance } from './controller';

type UseAuthStateTuple = [
    User | null,
    boolean,
    Error | undefined,
];

export function useAuthState(): UseAuthStateTuple {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error>();

    useEffect(() => {
        onAuthStateChanged(authInstance, (user) => {
            setLoading(false);
            setUser(user);
        }, setError);
    }, []);

    return [user, loading, error];
}

type UseAuthTokenIdTuple = [
    string | undefined,
    boolean,
    Error | undefined,
];

export function useAuthTokenId(): UseAuthTokenIdTuple {
    const [tokenId, setTokenId] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error>();

    useEffect(() => {
        authInstance.currentUser?.getIdToken().then((tokenId) => {
            setTokenId(tokenId);
            setLoading(false);
        }).catch(function(error) {
            setError(error);
            setLoading(false);
        });
    }, []);

    return [tokenId, loading, error];
}