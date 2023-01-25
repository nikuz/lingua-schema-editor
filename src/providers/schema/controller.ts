import { apiUtils } from 'src/utils';

export interface GetListProps {
    token: string,
    signal?: AbortSignal,
}

export function getList(props: GetListProps) {
    const {
        token,
        signal,
    } = props;

    return fetch(`${apiUtils.getApiUrl()}/schemas`, {
        signal,
        headers: {
            'content-type': 'application/json',
            'Authorization': token,
        },
    }).then(async (response) => {
        if (response.ok) {
            return await response.json();
        }
        const text = await response.text();
        throw new Error(text || response.status.toString());
    });
}
