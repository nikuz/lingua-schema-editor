import React from 'react';
import { Typography } from '@mui/material';
import {
    Collapsable,
    SchemaItem,
} from 'src/components';
import { TranslationSchemaContext } from 'src/helpers';
import { PronunciationSchemaType } from 'src/types';

interface Props {
    data: any,
    schema: PronunciationSchemaType,
    onDataPathSelect: (schemaPath: string, dataPath: string) => void,
}

export default function SchemaEditPronunciationBuilder(props: Props) {
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
                    Pronunciation schema
                </Typography>
                <SchemaItem
                    title="Value"
                    data={data}
                    schema={schema}
                    schemaPath="data.value"
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
