import { apiUtils } from 'src/utils';
import {
    LanguagesType,
    ObjectDataString,
    ProxyResponse,
} from 'src/types';
import * as consentController from './consent';

const languageCodesRegExp = /data:\s?(\[\[\["auto",\s?"Detect language"[^\n]+]]]),/;

interface Props {
    url: string,
    token: string,
}

export function retrieve(props: Props): Promise<LanguagesType> {
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
