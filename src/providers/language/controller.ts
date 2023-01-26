import { apiUtils } from 'src/utils';
import { LanguagesType } from 'src/types';

export interface GetLanguagesProps {
    token: string,
    signal?: AbortSignal,
}

export function getLanguages(props: GetLanguagesProps): Promise<LanguagesType> {
    const {
        token,
        signal,
    } = props;

    return fetch(`${apiUtils.getApiUrl()}/languages`, {
        signal,
        headers: {
            'content-type': 'application/json',
            'authorization': token,
        },
    }).then(async (response) => {
        if (response.ok) {
            return await response.json();
        }
        const text = await response.text();
        throw new Error(text || response.status.toString());
    });
}

export interface StoreLanguagesProps {
    token: string,
    languages: LanguagesType,
    signal?: AbortSignal,
}

export function storeLanguages(props: StoreLanguagesProps): Promise<LanguagesType> {
    const {
        token,
        languages,
        signal,
    } = props;

    return fetch(`${apiUtils.getApiUrl()}/languages`, {
        method: 'POST',
        signal,
        headers: {
            'content-type': 'application/json',
            'authorization': token,
        },
        body: JSON.stringify(languages),
    }).then(async (response) => {
        if (response.ok) {
            return await response.json();
        }
        const text = await response.text();
        throw new Error(text || response.status.toString());
    });
}