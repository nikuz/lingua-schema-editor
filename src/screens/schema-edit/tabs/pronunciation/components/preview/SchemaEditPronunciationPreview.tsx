import React from 'react';
import { Box } from '@mui/material';
import jmespath from 'jmespath';
import { PronunciationSchemaType } from 'src/types';

interface Props {
    schema: PronunciationSchemaType,
    translateResponseJson: any,
}

export default function SchemaEditPronunciationPreview(props: Props) {
    const {
        schema,
        translateResponseJson,
    } = props;

    if (!schema.data || schema.data.value === '') {
        return null;
    }

    const value = jmespath.search(translateResponseJson, schema.data.value);

    return (
        <Box sx={{ mt: 4 }}>
            <audio
                src={`${schema.fields.base64Prefix}${value}`}
                controls
            />
        </Box>
    );
}
