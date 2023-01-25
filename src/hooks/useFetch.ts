import { useCallback, useRef, useState } from 'react';

type Handler = (props: any) => Promise<any>

export interface FetchState {
    loading: boolean,
    error?: Error,
    data?: any,
}

type ResponseTuple = [
    (parameters?: { [name: string]: any }) => Promise<any>,
    FetchState,
];

export function useFetch({ handler }: { handler: Handler }): ResponseTuple {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();
    const [data, setData] = useState<any>();
    const requestSignal = useRef<AbortController>();

    const requestHandler = useCallback((parameters?: { [name: string]: any }) => {
        setError(undefined);
        setLoading(true);
        requestSignal.current?.abort();
        requestSignal.current = new AbortController();

        const request = handler({
            ...parameters,
            signal: requestSignal.current?.signal,
        });

        request.then((data) => {
            setLoading(false);
            setData(data);
            return data;
        }).catch((err) => {
            // don't react if request was aborted by user
            if (err instanceof DOMException) {
                return;
            }
            setLoading(false);
            setError(new Error(err.message));
            return err;
        });

        return request;
    }, [handler]);

    return [requestHandler, {
        loading,
        error,
        data,
    }];
}