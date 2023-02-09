import {
    CookieConsentSchemaType,
    ImagesSchemaType,
    PronunciationSchemaType,
    QuickTranslationSchemaType,
    TranslationSchemaType,
} from 'server-types';

export interface SchemaEditCache {
    cookie_consent: SchemaEditCacheCookieConsent,
    quick_translation: SchemaEditCacheQuickTranslation,
    translation: SchemaEditCacheTranslation,
    pronunciation: SchemaEditCachePronunciation,
    images: SchemaEditCacheImages,
}

export interface SchemaEditCacheCookieConsent {
    initiated: boolean,
    responseText?: string,
    form?: string,
    inputs?: string[],
    schema?: CookieConsentSchemaType,
}

export interface SchemaEditCacheQuickTranslation {
    initiated: boolean,
    responseText?: string,
    responseJson?: any,
    schema?: QuickTranslationSchemaType,
}

export interface SchemaEditCacheTranslation {
    initiated: boolean,
    responseText?: string,
    responseJson?: any,
    schema?: TranslationSchemaType,
}

export interface SchemaEditCachePronunciation {
    initiated: boolean,
    responseText?: string,
    responseJson?: any,
    schema?: PronunciationSchemaType,
}

export interface SchemaEditCacheImages {
    initiated: boolean,
    images?: string[],
    schema?: ImagesSchemaType,
}

export enum SchemaEditCacheKeys {
    cookie_consent = 'cookie_consent',
    quick_translation = 'quick_translation',
    translation = 'translation',
    pronunciation = 'pronunciation',
    images = 'images',
}

export type SetSchemaEditCacheCallback = (
    key: SchemaEditCacheKeys,
    cachePart: SchemaEditCacheCookieConsent
        | SchemaEditCacheQuickTranslation
        | SchemaEditCacheTranslation
        | SchemaEditCachePronunciation
        | SchemaEditCacheImages,
) => void;