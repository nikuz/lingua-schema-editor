import {
    ImagesSchemaType,
    PronunciationSchemaType,
    QuickTranslationSchemaType,
    TranslationSchemaType,
} from 'src/types';

export interface SchemaEditCache {
    quick_translation: SchemaEditCacheQuickTranslation,
    translation: SchemaEditCacheTranslation,
    pronunciation: SchemaEditCachePronunciation,
    images: SchemaEditCacheImages,
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
    quick_translation = 'quick_translation',
    translation = 'translation',
    pronunciation = 'pronunciation',
    images = 'images',
}

export type SetSchemaEditCacheCallback = (
    key: SchemaEditCacheKeys,
    cachePart: SchemaEditCacheQuickTranslation
        | SchemaEditCacheTranslation
        | SchemaEditCachePronunciation
        | SchemaEditCacheImages,
) => void;