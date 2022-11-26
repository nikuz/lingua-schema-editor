import {
    ImagesSchemaType,
    PronunciationSchemaType,
    TranslationSchemaType,
} from '../../types';

export interface SchemaEditCache {
    translation: SchemaEditCacheTranslation,
    pronunciation: SchemaEditCachePronunciation,
    images: SchemaEditCacheImages,
}

export interface SchemaEditCacheTranslation {
    responseText?: string,
    responseJson?: any,
    schema?: TranslationSchemaType,
}

export interface SchemaEditCachePronunciation {
    responseText?: string,
    responseJson?: any,
    schema?: PronunciationSchemaType,
}

export interface SchemaEditCacheImages {
    images?: string[],
    schema?: ImagesSchemaType,
}

export enum SchemaEditCacheKeys {
    translation = 'translation',
    pronunciation = 'pronunciation',
    images = 'images',
}

export type SetSchemaEditCacheCallback = (
    key: SchemaEditCacheKeys,
    cachePart: SchemaEditCacheTranslation | SchemaEditCachePronunciation | SchemaEditCacheImages,
) => void;