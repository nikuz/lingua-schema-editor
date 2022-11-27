import React from 'react';
import cl from 'classnames';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Box,
    Chip,
} from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import jmespath from 'jmespath';
import { TranslationSchemaType } from 'src/types';
import './SchemaEditTranslationPreview.css';

interface Props {
    schema: TranslationSchemaType,
    translationResponseJson: any,
}

export default function SchemaEditTranslationPreview(props: Props) {
    const {
        schema,
        translationResponseJson: source,
    } = props;

    const word = retrieveData(source, schema.word?.value);
    const autoSpellingFix = retrieveData(source, schema.auto_spelling_fix?.value);
    const correctedWord = autoSpellingFix || word;
    const translation = retrieveData(source, schema.translation?.value);
    const transcription = retrieveData(source, schema.transcription?.value);
    const alternativeTranslations = retrieveData(source, schema.alternative_translations?.value);
    const definitions = retrieveData(source, schema.definitions?.value);
    const examples = retrieveData(source, schema.examples?.value);

    return (
        <Card sx={{ mt: 4 }}>
            <CardHeader
                title={(
                    <Typography variant="h4">
                        {word}
                        {autoSpellingFix && ` [${autoSpellingFix}?]`}
                        &nbsp;=&nbsp;
                        {translation}
                    </Typography>
                )}
                subheader={(
                    <Typography variant="body1">
                        {transcription}
                    </Typography>
                )}
            />
            <CardContent>
                {alternativeTranslations && (
                    <Typography variant="h6">
                        Alternative Translations of <b>{correctedWord}</b>
                    </Typography>
                )}
                {Array.isArray(alternativeTranslations) && alternativeTranslations.map(speechPart => {
                    const speechPartName = retrieveData(speechPart, schema.alternative_translations?.speech_part?.value);
                    const items = retrieveData(speechPart, schema.alternative_translations?.items?.value);
                    return (
                        <Box key={speechPartName} sx={{ mt: 1, mb: 3 }}>
                            <i className="translation-speech-part">{speechPartName}</i>
                            {Array.isArray(items) && items.map((item, key) => {
                                const translation = retrieveData(item, schema.alternative_translations?.items?.translation?.value);
                                const words = retrieveData(item, schema.alternative_translations?.items?.words?.value);
                                const frequency = retrieveData(item, schema.alternative_translations?.items?.frequency?.value);
                                return (
                                    <div key={key} className="alternative-translation-row">
                                        <Typography variant="body1" sx={{ width: '30%' }}>
                                            {translation}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ ml: 2, mr: 2, flex: 1 }}
                                            className="translation-grey"
                                        >
                                            {Array.isArray(words) && words.join(', ')}
                                        </Typography>
                                        <div
                                            className={cl('alternative-translation-frequency', {
                                                f1: frequency === 1,
                                                f2: frequency === 2,
                                                f3: frequency === 3,
                                            })}
                                        >
                                            <div /><div /><div />
                                        </div>
                                    </div>
                                );
                            })}
                        </Box>
                    )
                })}

                {definitions && (
                    <Typography variant="h6" sx={{ mt: 5 }}>
                        Definitions of <b>{correctedWord}</b>
                    </Typography>
                )}
                {Array.isArray(definitions) && definitions.map(speechPart => {
                    const speechPartName = retrieveData(speechPart, schema.definitions?.speech_part?.value);
                    const speechPartType = retrieveData(speechPart, schema.definitions?.type?.value);
                    const items = retrieveData(speechPart, schema.definitions?.items?.value);
                    return (
                        <Box key={speechPartName} sx={{ mt: 1, mb: 3 }}>
                            <Box sx={{ mb: 1 }}>
                                <i className="translation-speech-part">{speechPartName}</i>
                                {speechPartType && (
                                    <Chip label={speechPartType} size="small" sx={{ ml: 1 }} />
                                )}
                            </Box>
                            {Array.isArray(items) && items.map((item, key) => {
                                const text = retrieveData(item, schema.definitions?.items?.text?.value);
                                const type = retrieveData(item, schema.definitions?.items?.type?.value);
                                const example = retrieveData(item, schema.definitions?.items?.example?.value);
                                const synonyms = retrieveData(item, schema.definitions?.items?.synonyms?.value);
                                return (
                                    <Box key={key} sx={{ mb: 2, pl: 9 }} className="relative">
                                        <span className="translation-definition-counter">
                                            {key + 1}
                                        </span>
                                        {type && (
                                            <div>
                                                <Chip label={type} size="small" />
                                            </div>
                                        )}
                                        {text}
                                        {example && (
                                            <Typography variant="body2" className="translation-grey">
                                                "{example}"
                                            </Typography>
                                        )}
                                        {synonyms && (
                                            <Typography
                                                variant="body2"
                                                className="translation-grey"
                                                sx={{ mt: 2 }}
                                            >
                                                Synonyms:
                                            </Typography>
                                        )}
                                        {Array.isArray(synonyms) && synonyms.map((synonym, synonymKey) => {
                                            const synonymType = retrieveData(synonym, schema.definitions?.items?.synonyms?.type?.value);
                                            const synonymsList = retrieveData(synonym, schema.definitions?.items?.synonyms?.items?.value);
                                            return (
                                                <Box key={synonymKey} component="span" sx={{ mr: 2 }}>
                                                    {synonymType && (
                                                        <Chip label={synonymType} size="small" />
                                                    )}
                                                    {Array.isArray(synonymsList) && synonymsList.map((synonymListItem, synonymListKey) => {
                                                        const text = retrieveData(synonymListItem, schema.definitions?.items?.synonyms?.items?.text?.value);
                                                        return (
                                                            <Chip
                                                                key={synonymListKey}
                                                                label={text}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ margin: '3px 2px' }}
                                                                className="translation-grey"
                                                            />
                                                        )
                                                    })}
                                                </Box>
                                            )
                                        })}
                                    </Box>
                                );
                            })}
                        </Box>
                    );
                })}

                {examples && (
                    <Typography variant="h6" sx={{ mt: 5, mb: 1 }}>
                        Examples of <b>{correctedWord}</b>
                    </Typography>
                )}
                {Array.isArray(examples) && examples.map((item, key) => {
                    const text = retrieveData(item, schema.examples?.text?.value);
                    return (
                        <Box key={key} sx={{ mb: 2, pl: 9 }} className="relative">
                            <FormatQuoteIcon className="translation-example-quote" />
                            <div dangerouslySetInnerHTML={{__html: text}} />
                        </Box>
                    );
                })}
            </CardContent>
        </Card>
    );
}

const retrieveData = (source: any, key?: string) => (
    key && jmespath.search(source, key)
);