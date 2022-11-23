export interface TranslationSchema {
    word?: TranslationSchemaItem,
    auto_spelling_fix?: TranslationSchemaItem,
    translation?: TranslationSchemaItem,
    transcription?: TranslationSchemaItem,
    alternative_translations?: TranslationSchemaAlternativeTranslations,
    definitions?: TranslationSchemaDefinitions,
    examples?: TranslationSchemaExamples,
}

interface TranslationSchemaItem {
    value: string,
}

export type TranslationSchemaAlternativeTranslations = TranslationSchemaItem & {
    speech_part?: TranslationSchemaItem,
    items?: TranslationSchemaItem & {
        translation?: TranslationSchemaItem,
        words?: TranslationSchemaItem,
        frequency?: TranslationSchemaItem,
    },
}

export type TranslationSchemaDefinitions = TranslationSchemaItem & {
    speech_part?: TranslationSchemaItem,
    type?: TranslationSchemaItem,
    items?: TranslationSchemaItem & {
        text?: TranslationSchemaItem,
        example?: TranslationSchemaItem,
        type?: TranslationSchemaItem,
        synonyms?: TranslationSchemaItem & {
            type?: TranslationSchemaItem,
            items?: TranslationSchemaItem & {
                text?: TranslationSchemaItem,
            },
        },
    },
}

export type TranslationSchemaExamples = TranslationSchemaItem & {
    text?: TranslationSchemaItem,
}

