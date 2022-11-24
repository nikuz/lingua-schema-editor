import React, { useCallback, useState } from 'react';
import jmespath from 'jmespath';
import { Box, TextField } from '@mui/material';
import {
    Collapsable,
    TranslateForm,
    PronunciationSchema,
} from '../../../../components';
import { jsonUtils } from '../../../../utils';
import { PronunciationSchemaType } from '../../../../types';

const {
    REACT_APP_TRANSLATION_URL,
    REACT_APP_PRONUNCIATION_MARKER,
    REACT_APP_TRANSLATION_BODY_PARAMETER,
    REACT_APP_PRONUNCIATION_BODY,
} = process.env;

export default function SchemaEditPronunciation() {
    const [translateResponseText, setTranslateResponseText] = useState<string>();
    const [translateResponseJson, setTranslateResponseJson] = useState<{}>();
    const [resultSchema, setResultSchema] = useState<PronunciationSchemaType>({
        value: '',
        base64Prefix: 'data:audio/mp3;base64,',
    });

    const populateSchemaHandler = useCallback((schemaPath: string, dataPath: string) => {
        setResultSchema(jsonUtils.populateJsonByPath(resultSchema, schemaPath, dataPath));
    }, [resultSchema]);

    return <>
        <TranslateForm
            url={REACT_APP_TRANSLATION_URL || ''}
            marker={REACT_APP_PRONUNCIATION_MARKER || ''}
            parameter={REACT_APP_TRANSLATION_BODY_PARAMETER || ''}
            body={REACT_APP_PRONUNCIATION_BODY || ''}
            bodyVariables={['{word}', '{sourceLanguage}']}
            onDataReceive={(originalResponse: string, data: any) => {
                setTranslateResponseText(originalResponse);
                setTranslateResponseJson(data);
            }}
        />
        <Box sx={{ mt: 3 }}>
            <TextField
                variant="outlined"
                label="Base 64 prefix"
                size="small"
                value={resultSchema.base64Prefix}
                fullWidth
                onChange={(event) => {
                    populateSchemaHandler('base64Prefix', event.target.value);
                }}
            />
        </Box>
        {translateResponseJson && (
            <PronunciationSchema
                data={translateResponseJson}
                schema={resultSchema}
                onDataPathSelect={populateSchemaHandler}
            />
        )}
        {translateResponseText && (
            <Collapsable title="Original response">
                <div className="text-ellipsis">
                    {translateResponseText}
                </div>
            </Collapsable>
        )}
        {resultSchema.value !== '' && (
            <Box sx={{ mt: 4 }}>
                <audio
                    src={`${resultSchema.base64Prefix}${jmespath.search(translateResponseJson, resultSchema.value)}`}
                    controls
                    autoPlay
                />
            </Box>
        )}
    </>;
}
