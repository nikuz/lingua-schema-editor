import { TranslationSchemaType } from  './translation-schema';
import { PronunciationSchemaType } from  './pronunciation-schema';
import { ImagesSchemaType } from  './images-schema';

export interface ResultSchemaType {
    translation?: TranslationSchemaType,
    pronunciation?: PronunciationSchemaType,
    images?: ImagesSchemaType,
}

export interface CloudSchemaType {
    id: string,
    version: string,
    schema: string, // JSON stringify of ResultSchemaType
    current: boolean,
    createdAt: number, // Date.now()
    updatedAt: number, // Date.now()
}