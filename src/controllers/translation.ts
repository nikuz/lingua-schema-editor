import { apiProviders } from 'src/providers';

interface Props {
    url: string,
    body: Object,
}

export function translate(props: Props) {
    return fetch(`${apiProviders.getApiUrl()}/translate?url=${props.url}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(props.body),
    }).then(async (response) => {
        const text = await response.text();
        if (response.status === 200) {
            return text;
        }
        throw new Error(text || response.status.toString());
    });
}
