import { TranslationSchemaType } from  './translation-schema';
import { PronunciationSchemaType } from  './pronunciation-schema';
import { ImagesSchemaType } from  './images-schema';

export interface ResultSchemaType {
    translation?: TranslationSchemaType,
    pronunciation?: PronunciationSchemaType,
    images?: ImagesSchemaType,
}