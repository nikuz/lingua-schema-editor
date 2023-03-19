import { SchemaItemType } from './schema-item';

export interface QuickTranslationSchemaType {
    fields: QuickTranslationSchemaTypeFields,
    auto_language_code?: SchemaItemType,
    sentences?: SchemaItemType & {
        original_word?: SchemaItemType,
        translation?: SchemaItemType,
    },
}

export interface QuickTranslationSchemaTypeFields {
    url: string,
}

export type QuickTranslationSchemaTypeFieldsName = keyof QuickTranslationSchemaTypeFields;