interface TranslationSchemaItem {
    value: string,
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


export interface TranslationSchema {
    definitions?: TranslationSchemaDefinitions,
}

