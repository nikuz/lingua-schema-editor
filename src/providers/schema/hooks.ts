import { useFetch, FetchState } from 'src/hooks';
import {
    GetListProps,
    getList,
} from './controller';
import { ObjectData, CloudSchemaType } from 'src/types';

type GetListTuple = [
    (props: GetListProps) => Promise<ObjectData>,
    Omit<FetchState, 'data'> & {
        data?: CloudSchemaType[],
    }
];

export function useGetSchemaList(): GetListTuple {
    return useFetch({
        handler: getList,
    });
}