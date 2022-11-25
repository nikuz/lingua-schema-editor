import React from 'react';
import { Typography } from '@mui/material';
import { Collapsable } from '../../../../../components';
import { TranslationSchemaContext } from '../../../../../helpers';
import { TranslationSchemaType } from '../../../../../types';
import TranslationSchemaTranslation from './TranslationSchemaTranslation';
import TranslationSchemaAlternativeTranslations from './TranslationSchemaAlternativeTranslations';
import TranslationSchemaDefinitions from './TranslationSchemaDefinitions';
import TranslationSchemaExamples from './TranslationSchemaExamples';
import './TranslationSchema.css';

interface Props {
    data: any,
    schema: TranslationSchemaType,
    onDataPathSelect: (schemaPath: string, dataPath: string) => void,
}

export default function TranslationSchema(props: Props) {
    const {
        data,
        schema,
        onDataPathSelect,
    } = props;

    return (
        <TranslationSchemaContext.Provider value={{ onDataPathSelect }}>
            <div className="translation-schema-container">
                <Typography
                    variant="h4"
                    sx={{ mt: 3 }}
                    gutterBottom
                >
                    Translation Schema
                </Typography>
                <TranslationSchemaTranslation
                    data={data}
                    schema={schema}
                />
                <TranslationSchemaAlternativeTranslations
                    data={data}
                    schema={schema}
                />
                <TranslationSchemaDefinitions
                    data={data}
                    schema={schema}
                />
                <TranslationSchemaExamples
                    data={data}
                    schema={schema}
                />
                <Collapsable title="Schema" headerSize="h5" marginTop={5}>
                    <pre>
                        {JSON.stringify(schema, null, 4)}
                    </pre>
                </Collapsable>
            </div>
        </TranslationSchemaContext.Provider>
    );
}
