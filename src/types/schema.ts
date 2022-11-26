import { TranslationSchemaType } from  './translation-schema';
import { PronunciationSchemaType } from  './pronunciation-schema';
import { ImagesSchemaType } from  './images-schema';

export interface ResultSchemaType {
    version?: string,
    translation?: TranslationSchemaType,
    pronunciation?: PronunciationSchemaType,
    images?: ImagesSchemaType,
}

export enum ResultSchemaKeys {
    translation = 'translation',
    pronunciation = 'pronunciation',
    images = 'images',
}

export type SetResultSchemaCallback = (
    key: ResultSchemaKeys,
    schema: TranslationSchemaType | PronunciationSchemaType | ImagesSchemaType,
) => void;