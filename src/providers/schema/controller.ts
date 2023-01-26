import { apiUtils } from 'src/utils';
import { CloudSchemaType } from 'src/types';

export interface GetListProps {
    token: string,
    signal?: AbortSignal,
}

export function getList(props: GetListProps): Promise<CloudSchemaType[]> {
    const {
        token,
        signal,
    } = props;

    return fetch(`${apiUtils.getApiUrl()}/api/schemas`, {
        signal,
        headers: {
            'content-type': 'application/json',
            'authorization': token,
        },
    }).then(async (response) => {
        if (response.ok) {
            return await response.json();
        }
        const text = await response.text();
        throw new Error(text || response.status.toString());
    });
}

export interface GetProps {
    token: string,
    id: string,
    signal?: AbortSignal,
}

export function get(props: GetProps): Promise<CloudSchemaType> {
    const {
        token,
        id,
        signal,
    } = props;

    return fetch(`${apiUtils.getApiUrl()}/api/schema/${id}`, {
        signal,
        headers: {
            'content-type': 'application/json',
            'authorization': token,
        },
    }).then(async (response) => {
        if (response.ok) {
            return await response.json();
        }
        const text = await response.text();
        throw new Error(text || response.status.toString());
    });
}

export interface SetCurrentProps {
    token: string,
    id: string,
    signal?: AbortSignal,
}

export function setCurrent(props: SetCurrentProps): Promise<CloudSchemaType> {
    const {
        token,
        id,
        signal,
    } = props;

    return fetch(`${apiUtils.getApiUrl()}/api/schema/${id}`, {
        method: 'PUT',
        signal,
        headers: {
            'content-type': 'application/json',
            'authorization': token,
        },
    }).then(async (response) => {
        if (response.ok) {
            return await response.json();
        }
        const text = await response.text();
        throw new Error(text || response.status.toString());
    });
}

export interface AddProps {
    token: string,
    schema: CloudSchemaType,
    signal?: AbortSignal,
}

export function add(props: AddProps): Promise<CloudSchemaType> {
    const {
        token,
        schema,
        signal,
    } = props;

    return fetch(`${apiUtils.getApiUrl()}/api/schemas`, {
        method: 'POST',
        signal,
        headers: {
            'content-type': 'application/json',
            'authorization': token,
        },
        body: JSON.stringify(schema),
    }).then(async (response) => {
        if (response.ok) {
            return await response.json();
        }
        const text = await response.text();
        throw new Error(text || response.status.toString());
    });
}

export interface UpdateProps {
    token: string,
    id: string,
    schema: CloudSchemaType,
    signal?: AbortSignal,
}

export function update(props: UpdateProps): Promise<CloudSchemaType> {
    const {
        token,
        id,
        schema,
        signal,
    } = props;

    return fetch(`${apiUtils.getApiUrl()}/api/schema/${id}`, {
        method: 'POST',
        signal,
        headers: {
            'content-type': 'application/json',
            'authorization': token,
        },
        body: JSON.stringify(schema),
    }).then(async (response) => {
        if (response.ok) {
            return await response.json();
        }
        const text = await response.text();
        throw new Error(text || response.status.toString());
    });
}

export interface RemoveProps {
    token: string,
    id: string,
    signal?: AbortSignal,
}

export function remove(props: RemoveProps): Promise<number> {
    const {
        token,
        id,
        signal,
    } = props;

    return fetch(`${apiUtils.getApiUrl()}/api/schema/${id}`, {
        method: 'DELETE',
        signal,
        headers: {
            'content-type': 'application/json',
            'authorization': token,
        },
    }).then(async (response) => {
        if (response.ok) {
            return await response.json();
        }
        const text = await response.text();
        throw new Error(text || response.status.toString());
    });
}
