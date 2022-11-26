import React from 'react';
import { Box } from '@mui/material';
import jmespath from 'jmespath';
import { TranslationSchemaType } from 'src/types';

interface Props {
    schema: TranslationSchemaType,
    translationResponseJson: any,
}

export default function SchemaEditTranslationPreview(props: Props) {
    const {
        schema,
        translationResponseJson,
    } = props;



    return (
        <Box sx={{ mt: 4 }}>

        </Box>
    );
}
