import { ResultSchemaType } from 'src/types';

export function validateIntegrity(schema: ResultSchemaType): boolean {
    return !(
        !schema.translation
        || !schema.translation.fields
        || !schema.translation.fields.url
        || !schema.translation.fields.parameter
        || !schema.translation.fields.body
        || !schema.translation.fields.marker
        || !schema.translation.word
        || !schema.translation.word.value
        || !schema.translation.auto_spelling_fix
        || !schema.translation.auto_spelling_fix.value
        // transcription
        || !schema.translation.transcription
        || !schema.translation.transcription.value
        // translation
        || !schema.translation.translations
        || !schema.translation.translations.value
        || !schema.translation.translations.gender
        || !schema.translation.translations.gender.value
        || !schema.translation.translations.word
        || !schema.translation.translations.word.value
        || !schema.translation.translations.sentences
        || !schema.translation.translations.sentences.value
        || !schema.translation.translations.sentences.word
        || !schema.translation.translations.sentences.word.value
        // alternative translations
        || !schema.translation.alternative_translations
        || !schema.translation.alternative_translations.value
        || !schema.translation.alternative_translations.speech_part
        || !schema.translation.alternative_translations.speech_part.value
        || !schema.translation.alternative_translations.items
        || !schema.translation.alternative_translations.items.value
        || !schema.translation.alternative_translations.items.genre
        || !schema.translation.alternative_translations.items.genre.value
        || !schema.translation.alternative_translations.items.translation
        || !schema.translation.alternative_translations.items.translation.value
        || !schema.translation.alternative_translations.items.frequency
        || !schema.translation.alternative_translations.items.frequency.value
        || !schema.translation.alternative_translations.items.words
        || !schema.translation.alternative_translations.items.words.value
        // definitions
        || !schema.translation.definitions
        || !schema.translation.definitions.value
        || !schema.translation.definitions.speech_part
        || !schema.translation.definitions.speech_part.value
        || !schema.translation.definitions.type
        || !schema.translation.definitions.type.value
        || !schema.translation.definitions.items
        || !schema.translation.definitions.items.value
        || !schema.translation.definitions.items.type
        || !schema.translation.definitions.items.type.value
        || !schema.translation.definitions.items.text
        || !schema.translation.definitions.items.text.value
        || !schema.translation.definitions.items.example
        || !schema.translation.definitions.items.example.value
        || !schema.translation.definitions.items.synonyms
        || !schema.translation.definitions.items.synonyms.value
        || !schema.translation.definitions.items.synonyms.type
        || !schema.translation.definitions.items.synonyms.type.value
        || !schema.translation.definitions.items.synonyms.items
        || !schema.translation.definitions.items.synonyms.items.value
        || !schema.translation.definitions.items.synonyms.items.text
        || !schema.translation.definitions.items.synonyms.items.text.value
        // examples
        || !schema.translation.examples
        || !schema.translation.examples.value
        || !schema.translation.examples.text
        || !schema.translation.examples.text.value

        // pronunciation
        || !schema.pronunciation
        || !schema.pronunciation.fields
        || !schema.pronunciation.fields.url
        || !schema.pronunciation.fields.parameter
        || !schema.pronunciation.fields.body
        || !schema.pronunciation.fields.marker
        || !schema.pronunciation.fields.base64Prefix
        || !schema.pronunciation.data
        || !schema.pronunciation.data.value

        // images
        || !schema.images
        || !schema.images.fields
        || !schema.images.fields.url
        || !schema.images.fields.userAgent
        || !schema.images.fields.regExp
        || !schema.images.fields.minSize
    );
}