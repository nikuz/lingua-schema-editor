import { apiUtils } from 'src/utils';

interface Props {
    url: string,
    body: URLSearchParams,
    token: string,
}

export function translate(props: Props) {
    const {
        url,
        body,
        token,
    } = props;

    return fetch(`${apiUtils.getApiUrl()}/api/proxy?url=${encodeURIComponent(url)}`, {
        method: 'POST',
        headers: {
            'authorization': token,
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: body,
    }).then(async (response) => {
        const text = await response.text();
        if (response.status === 200) {
            return text;
        }
        throw new Error(text || response.status.toString());
    });
}
