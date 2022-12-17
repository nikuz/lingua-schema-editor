import { useState, useEffect } from 'react';
import { LanguagesType } from 'src/types';
import {
    firestoreDoc,
    firestoreGetDoc,
    firestoreInstance,
} from 'src/providers/firebase/controller';

type ResponseTuple = [
    LanguagesType | undefined,
    boolean,
    Error | undefined,
];

export function useStoredLanguages(): ResponseTuple {
    const [languages, setLanguages] = useState<LanguagesType>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | undefined>();

    useEffect(() => {
        setLoading(true);
        const docReference = firestoreDoc(firestoreInstance, 'languages', 'languages');
        firestoreGetDoc(docReference).then(response => {
            const data = response.data();
            try {
                setLanguages(JSON.parse(data?.raw));
            } catch (err) {
                setError(new Error('Can\'t parse retrieved languages as JSON array'));
            }
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            setError(err);
        });
    }, []);

    return [languages, loading, error];
}