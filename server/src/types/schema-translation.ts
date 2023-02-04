import { SchemaItemType } from './schema-item';

export interface TranslationSchemaType {
    fields: TranslationSchemaTypeFields,
    word?: SchemaItemType,
    auto_spelling_fix?: SchemaItemType,
    auto_language_code?: SchemaItemType,
    translations?: TranslationSchemaTypeTranslations,
    transcription?: SchemaItemType,
    alternative_translations?: TranslationSchemaTypeAlternativeTranslations,
    definitions?: TranslationSchemaTypeDefinitions,
    examples?: TranslationSchemaTypeExamples,
}

export interface TranslationSchemaTypeFields {
    url: string,
    url_parameter_rt: string,
    parameter: string,
    body: string,
    marker: string,
}

export type TranslationSchemaTypeFieldsName = keyof TranslationSchemaTypeFields;

export type TranslationSchemaTypeTranslations = SchemaItemType & {
    word: SchemaItemType,
    gender: SchemaItemType,
    sentences?: SchemaItemType & {
        word?: SchemaItemType,
    }
}

export type TranslationSchemaTypeAlternativeTranslations = SchemaItemType & {
    speech_part?: SchemaItemType,
    items?: SchemaItemType & {
        genre?: SchemaItemType,
        translation?: SchemaItemType,
        words?: SchemaItemType,
        frequency?: SchemaItemType,
    },
}

export type TranslationSchemaTypeDefinitions = SchemaItemType & {
    speech_part?: SchemaItemType,
    type?: SchemaItemType,
    items?: SchemaItemType & {
        text?: SchemaItemType,
        example?: SchemaItemType,
        type?: SchemaItemType,
        synonyms?: SchemaItemType & {
            type?: SchemaItemType,
            items?: SchemaItemType & {
                text?: SchemaItemType,
            },
        },
    },
}

export type TranslationSchemaTypeExamples = SchemaItemType & {
    text?: SchemaItemType,
}

