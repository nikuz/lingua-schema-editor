import { apiUtils } from 'src/utils';

interface Props {
    url: string,
    userAgent: string,
}

export function get(props: Props) {
    return fetch(`${apiUtils.getApiUrl()}/proxy?url=${encodeURIComponent(props.url)}`, {
        headers: {
            'user-agent': props.userAgent,
        }
    }).then(async (response) => {
        const text = await response.text();
        if (response.status === 200) {
            return text;
        }
        throw new Error(text || response.status.toString());
    });
}
