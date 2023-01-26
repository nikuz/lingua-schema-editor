import { useFetch, FetchState } from 'src/hooks';
import {
    GetLanguagesProps,
    getLanguages,
    StoreLanguagesProps,
    storeLanguages,
} from './controller';
import { LanguagesType } from 'src/types';

type GetLanguagesTuple = [
    (props: GetLanguagesProps) => Promise<LanguagesType>,
    Omit<FetchState, 'data'> & {
        data?: LanguagesType,
    }
];

export function useGetLanguages(): GetLanguagesTuple {
    return useFetch({
        handler: getLanguages,
    });
}

type StoreLanguagesTuple = [
    (props: StoreLanguagesProps) => Promise<LanguagesType>,
    Omit<FetchState, 'data'> & {
        data?: LanguagesType,
    }
];

export function useStoreLanguages(): StoreLanguagesTuple {
    return useFetch({
        handler: storeLanguages,
    });
}