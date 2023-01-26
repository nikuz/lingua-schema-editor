import { apiUtils } from 'src/utils';

export function getList(token: string) {
    return fetch(`${apiUtils.getApiUrl()}/schemas`, {
        headers: {
            'content-type': 'application/json',
            'authorization': token,
        },
    }).then(async (response) => {
        const text = await response.text();
        if (response.status === 200) {
            return JSON.parse(text);
        }
        throw new Error(text || response.status.toString());
    });
}
