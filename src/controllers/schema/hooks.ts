import { useFetch, FetchState } from 'src/hooks';
import {
    GetListProps,
    getList,
    GetProps,
    get,
    SetCurrentProps,
    setCurrent,
    AddProps,
    add,
    UpdateProps,
    update,
    RemoveProps,
    remove,
} from './controller';
import { CloudSchemaType } from 'src/types';

type GetListTuple = [
    (props: GetListProps) => Promise<CloudSchemaType[]>,
    Omit<FetchState, 'data'> & {
        data?: CloudSchemaType[],
    }
];

export function useGetSchemaList(): GetListTuple {
    return useFetch({
        handler: getList,
    });
}

type GetTuple = [
    (props: GetProps) => Promise<CloudSchemaType>,
    Omit<FetchState, 'data'> & {
        data?: CloudSchemaType,
    }
];

export function useGetSchema(): GetTuple {
    return useFetch({
        handler: get,
    });
}

type SetCurrentTuple = [
    (props: SetCurrentProps) => Promise<CloudSchemaType>,
    Omit<FetchState, 'data'> & {
        data?: CloudSchemaType,
    }
];

export function useSetCurrentSchema(): SetCurrentTuple {
    return useFetch({
        handler: setCurrent,
    });
}

type AddTuple = [
    (props: AddProps) => Promise<CloudSchemaType>,
    Omit<FetchState, 'data'> & {
        data?: CloudSchemaType,
    }
];

export function useAddSchema(): AddTuple {
    return useFetch({
        handler: add,
    });
}

type UpdateTuple = [
    (props: UpdateProps) => Promise<CloudSchemaType>,
    Omit<FetchState, 'data'> & {
        data?: CloudSchemaType,
    }
];

export function useUpdateSchema(): UpdateTuple {
    return useFetch({
        handler: update,
    });
}

type RemoveTuple = [
    (props: RemoveProps) => Promise<number>,
    Omit<FetchState, 'data'> & {
        data?: number,
    }
];

export function useRemoveSchema(): RemoveTuple {
    return useFetch({
        handler: remove,
    });
}