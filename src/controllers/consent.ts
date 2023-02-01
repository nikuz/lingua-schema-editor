import { apiUtils } from 'src/utils';
import { ProxyResponse } from 'src/types';

const formRegExp = /<form\s(.|\n)+?<\/form>/;
const inputRegExp = /<input\s[^>]*>/g;
const paramRegExpBase = '{param}=["|\']([^\'"]+)[\'|"]';
const actionRegExp = new RegExp(paramRegExpBase.replace('{param}', 'action'));
const nameRegExp = new RegExp(paramRegExpBase.replace('{param}', 'name'));
const valueRegExp = new RegExp(paramRegExpBase.replace('{param}', 'value'));

interface Props {
    url: string,
    token: string,
}

export function acquire(props: Props): Promise<void> {
    const {
        url,
        token,
    } = props;

    const cookie = apiUtils.getCookie();

    if (!cookie) {
        throw new Error('Cookie should be acquired prior saving the consent');
    }

    return fetch(`${apiUtils.getApiUrl()}/api/proxy?url=${encodeURIComponent(url)}`, {
        headers: {
            'authorization': token,
            'authorization-cookie': cookie?.join('; '),
            'authorization-origin': new URL(url).origin,
        },
    }).then(async (response) => {
        const data: ProxyResponse = await response.json();
        if (data.statusCode === 200) {
            const form = data.text.match(formRegExp);
            if (form) {
                const action = form[0].match(actionRegExp);
                const body = new URLSearchParams();
                const inputs = form[0].match(inputRegExp);

                if (inputs) {
                    for (const input of inputs) {
                        const name = input.match(nameRegExp);
                        const value = input.match(valueRegExp);

                        if (name && value) {
                            body.append(name[1], value[1]);
                        }
                    }
                }

                if (action) {
                    return save({
                        url: action[1],
                        token,
                        cookie,
                        body,
                    });
                }
            }
        }
        throw new Error(data.text || data.statusCode.toString());
    });
}

interface SaveProps {
    url: string,
    token: string,
    cookie: string[],
    body: URLSearchParams,
}

export function save(props: SaveProps): Promise<void> {
    const {
        url,
        token,
        cookie,
        body,
    } = props;

    return fetch(`${apiUtils.getApiUrl()}/api/proxy?url=${encodeURIComponent(url)}`, {
        method: 'POST',
        headers: {
            'authorization': token,
            'authorization-cookie': cookie.join('; '),
            'authorization-origin': new URL(url).origin,
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body,
    }).then(async (response) => {
        const data: ProxyResponse = await response.json();
        if (data.statusCode === 303 || data.statusCode === 204) {
            apiUtils.setCookie(apiUtils.mergeCookie([cookie, data.headers['set-cookie']]));
            return;
        }
        throw new Error(data.text || data.statusCode.toString());
    });
}
