import { apiProviders } from '../providers';

interface Props {
    url: string,
    userAgent: string,
}

export function get(props: Props) {
    const url = `${apiProviders.getApiUrl()}/images?url=${encodeURIComponent(props.url)}&userAgent=${props.userAgent}`;
    return fetch(url).then(async (response) => {
        const text = await response.text();
        if (response.status === 200) {
            return text;
        }
        throw new Error(text || response.status.toString());
    });
}
