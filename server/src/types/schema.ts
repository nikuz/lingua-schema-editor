import { CookieConsentSchemaType } from  './schema-cookie-consent';
import { QuickTranslationSchemaType } from  './schema-quick-translation';
import { TranslationSchemaType } from  './schema-translation';
import { PronunciationSchemaType } from  './schema-pronunciation';
import { ImagesSchemaType } from  './schema-images';

export interface ResultSchemaType {
    cookie_consent?: CookieConsentSchemaType,
    quick_translation?: QuickTranslationSchemaType,
    translation?: TranslationSchemaType,
    pronunciation?: PronunciationSchemaType,
    images?: ImagesSchemaType,
}

export interface CloudSchemaType {
    version: string,
    schema: string, // JSON stringify of ResultSchemaType
    current: boolean,
    createdAt: number, // Date.now()
    updatedAt: number, // Date.now()
}