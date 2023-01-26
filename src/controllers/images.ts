import { apiUtils } from 'src/utils';

interface Props {
    url: string,
    userAgent: string,
    token: string,
}

export function get(props: Props) {
    const {
        url,
        userAgent,
        token,
    } = props;

    return fetch(`${apiUtils.getApiUrl()}/api/proxy?url=${encodeURIComponent(url)}`, {
        headers: {
            'authorization': token,
            'user-agent': userAgent,
        }
    }).then(async (response) => {
        const text = await response.text();
        if (response.status === 200) {
            return text;
        }
        throw new Error(text || response.status.toString());
    });
}
