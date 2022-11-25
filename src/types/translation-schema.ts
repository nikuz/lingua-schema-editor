import { SchemaItemType } from './schema';

export interface TranslationSchemaType {
    url: string,
    parameter: string,
    body: string,
    marker: string,
    word?: SchemaItemType,
    auto_spelling_fix?: SchemaItemType,
    translation?: SchemaItemType,
    transcription?: SchemaItemType,
    alternative_translations?: TranslationSchemaTypeAlternativeTranslations,
    definitions?: TranslationSchemaTypeDefinitions,
    examples?: TranslationSchemaTypeExamples,
}

export type TranslationSchemaTypeAlternativeTranslations = SchemaItemType & {
    speech_part?: SchemaItemType,
    items?: SchemaItemType & {
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

