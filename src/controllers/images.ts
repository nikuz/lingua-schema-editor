import { apiUtils } from 'src/utils';
import { ObjectDataString, ProxyResponse } from '../types';
import * as consentController from './consent';

interface Props {
    url: string,
    userAgent: string,
    token: string,
}

export function get(props: Props): Promise<string> {
    const {
        url,
        userAgent,
        token,
    } = props;

    const headers: ObjectDataString = {
        'authorization': token,
        'authorization-origin': new URL(url).origin,
        'user-agent': userAgent,
    };

    const cookie = apiUtils.getCookie();
    if (cookie) {
        headers['authorization-cookie'] = cookie.join('; ');
    }

    return fetch(`${apiUtils.getApiUrl()}/api/proxy?url=${encodeURIComponent(url)}`, {
        headers
    }).then(async (response) => {
        const data: ProxyResponse = await response.json();
        if (data.headers['set-cookie']) {
            apiUtils.setCookie(apiUtils.mergeCookie([cookie, data.headers['set-cookie']]));
        }
        if (data.statusCode === 200) {
            return data.text;
        }
        else if (data.statusCode === 302 && data.headers['location'].includes('consent')) {
            await consentController.acquire({
                url: data.headers['location'],
                token,
            });
            return get(props);
        }
        throw new Error(data.text || response.status.toString());
    });
}
