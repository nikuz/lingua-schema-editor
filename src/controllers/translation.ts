interface Props {
    url: string,
    body: URLSearchParams,
}

export function translate(props: Props) {
    return fetch(props.url, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: props.body,
    }).then(async (response) => {
        const text = await response.text();
        if (response.status === 200) {
            return text;
        }
        throw new Error(text || response.status.toString());
    });
}
