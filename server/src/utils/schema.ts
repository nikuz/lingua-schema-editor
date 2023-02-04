import { ResultSchemaType } from '../types';

export function validateIntegrity(schema: ResultSchemaType): boolean {
    return !(
        // quick translation
        !schema.quick_translation?.fields.url
        || !schema.quick_translation.sentences?.original_word?.value
        || !schema.quick_translation.sentences.translation?.value

        // translation
        || !schema.translation?.fields.url
        || !schema.translation?.fields.parameter
        || !schema.translation.fields.body
        || !schema.translation.fields.marker
        || !schema.translation.word?.value
        || !schema.translation.auto_spelling_fix?.value
        || !schema.translation.auto_language_code?.value
        // transcription
        || !schema.translation.transcription?.value
        // translations
        || !schema.translation.translations?.value
        || !schema.translation.translations.gender.value
        || !schema.translation.translations.word.value
        || !schema.translation.translations.sentences
        || !schema.translation.translations.sentences.value
        || !schema.translation.translations.sentences.word
        || !schema.translation.translations.sentences.word.value
        // alternative translations
        || !schema.translation.alternative_translations?.value
        || !schema.translation.alternative_translations.speech_part?.value
        || !schema.translation.alternative_translations.items?.value
        || !schema.translation.alternative_translations.items.genre?.value
        || !schema.translation.alternative_translations.items.translation?.value
        || !schema.translation.alternative_translations.items.frequency?.value
        || !schema.translation.alternative_translations.items.words?.value
        // definitions
        || !schema.translation.definitions?.value
        || !schema.translation.definitions.speech_part?.value
        || !schema.translation.definitions.type?.value
        || !schema.translation.definitions.items?.value
        || !schema.translation.definitions.items.type?.value
        || !schema.translation.definitions.items.text?.value
        || !schema.translation.definitions.items.example?.value
        || !schema.translation.definitions.items.synonyms?.value
        || !schema.translation.definitions.items.synonyms.type?.value
        || !schema.translation.definitions.items.synonyms.items?.value
        || !schema.translation.definitions.items.synonyms.items.text?.value
        // examples
        || !schema.translation.examples?.value
        || !schema.translation.examples.text?.value

        // pronunciation
        || !schema.pronunciation?.fields.url
        || !schema.pronunciation.fields.parameter
        || !schema.pronunciation.fields.body
        || !schema.pronunciation.fields.marker
        || !schema.pronunciation.fields.base64Prefix
        || !schema.pronunciation.data?.value

        // images
        || !schema.images?.fields.url
        || !schema.images.fields.userAgent
        || !schema.images.fields.regExp
        || !schema.images.fields.minSize
        || !schema.images.fields.safeSearchUrl
        || !schema.images.fields.safeSearchSignatureRegExp
    );
}