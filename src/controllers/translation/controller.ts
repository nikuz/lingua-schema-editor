import { apiUtils } from 'src/utils';
import { ObjectDataString, ProxyResponse } from 'src/types';
import { consentController } from '../consent';

interface Props {
    url: string,
    body?: URLSearchParams,
    token: string,
}

export function translate(props: Props): Promise<string> {
    const {
        url,
        body,
        token,
    } = props;

    const headers: ObjectDataString = {
        'authorization': token,
        'authorization-origin': new URL(url).origin,
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    };

    const cookie = apiUtils.getCookie();
    if (cookie) {
        headers['authorization-cookie'] = cookie.join('; ');
    }

    return fetch(`${apiUtils.getApiUrl()}/api/proxy?url=${encodeURIComponent(url)}`, {
        method: 'POST',
        headers: headers,
        body: body,
    }).then(async (response) => {
        const data: ProxyResponse = await response.json();
        if (data.headers['set-cookie']) {
            apiUtils.setCookie(apiUtils.mergeCookie([cookie, data.headers['set-cookie']]));
        }
        if (data.statusCode === 200) {
            return data.text;
        } else if (data.statusCode === 302 && data.headers['location'].includes('consent')) {
            await consentController.acquire({
                url: data.headers['location'],
                token,
            });
            return translate(props);
        }
        throw new Error(data.text || response.status.toString());
    });
}
