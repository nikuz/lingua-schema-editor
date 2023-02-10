import { apiUtils } from 'src/utils';
import {
    LanguagesType,
    ObjectDataString,
    ProxyResponse,
} from 'src/types';
import { consentController } from '../consent';

const languageCodesRegExp = /data:\s?(\[\[\["auto",\s?"Detect language"[^\n]+]]]),/;

interface RetrieveProps {
    url: string,
    token: string,
}

export function retrieve(props: RetrieveProps): Promise<LanguagesType> {
    const {
        url,
        token,
    } = props;

    const headers: ObjectDataString = {
        'authorization': token,
        'authorization-origin': new URL(url).origin,
    };

    const cookie = apiUtils.getCookie();
    if (cookie) {
        headers['authorization-cookie'] = cookie.join('; ');
    }

    return fetch(`${apiUtils.getApiUrl()}/api/proxy?url=${encodeURIComponent(url)}`, {
        headers,
    }).then(async (response) => {
        const data: ProxyResponse = await response.json();
        if (data.headers['set-cookie']) {
            apiUtils.setCookie(apiUtils.mergeCookie([cookie, data.headers['set-cookie']]));
        }
        if (data.statusCode === 200) {
            const languageCodesStrings = data.text.match(languageCodesRegExp);

            if (!languageCodesStrings || !languageCodesStrings[0]) {
                throw new Error('Can\'t retrieve list of languages from server response');
            }

            let languageCodes;
            try {
                languageCodes = JSON.parse(languageCodesStrings[0].replace(languageCodesRegExp, '$1'));
            } catch (e) {
                throw new Error('Can\'t parse retrieved languages as JSON array');
            }

            const supportedLanguages = new Map();

            for (const item of languageCodes[0]) {
                if (item[0] !== 'auto') {
                    supportedLanguages.set(item[0], item[1]);
                }
            }

            return Object.fromEntries(supportedLanguages);
        } else if (data.statusCode === 302 && data.headers['location'].includes('consent')) {
            await consentController.acquire({
                url: data.headers['location'],
                token,
            });
            return retrieve(props);
        }
        throw new Error(data.text || data.statusCode.toString());
    });
}


export interface GetLanguagesProps {
    token: string,
    signal?: AbortSignal,
}

export function getLanguages(props: GetLanguagesProps): Promise<LanguagesType> {
    const {
        token,
        signal,
    } = props;

    return fetch(`${apiUtils.getApiUrl()}/api/languages`, {
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

    return fetch(`${apiUtils.getApiUrl()}/api/auth/languages`, {
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