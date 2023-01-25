import { useState, useEffect } from 'react';
import { authInstance } from './controller';

export { useAuthState } from 'react-firebase-hooks/auth';

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