import { apiProviders } from '../providers';

interface TranslateProps {
    url: string,
    body: Object,
}

export function translate(props: TranslateProps) {
    return fetch(`${apiProviders.getApiUrl()}/translate?url=${props.url}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(props.body),
    }).then((response) => {
        return response.text();
    }).catch(e => {
        console.log(e);
    });
}
