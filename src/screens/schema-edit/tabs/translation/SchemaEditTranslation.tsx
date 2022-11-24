import React, { useState, useCallback } from 'react';
import {
    TranslationSchema,
    Collapsable,
    TranslateForm,
} from '../../../../components';
import { jsonUtils } from '../../../../utils';
import { TranslationSchemaType } from '../../../../types';

const {
    REACT_APP_TRANSLATION_URL,
    REACT_APP_TRANSLATION_MARKER,
    REACT_APP_TRANSLATION_BODY_PARAMETER,
    REACT_APP_TRANSLATION_BODY,
} = process.env;

export default function SchemaEditTranslation() {
    const [translateResponseText, setTranslateResponseText] = useState<string>();
    const [translateResponseJson, setTranslateResponseJson] = useState<{}>();
    const [resultSchema, setResultSchema] = useState<TranslationSchemaType>({});

    const populateSchemaHandler = useCallback((schemaPath: string, dataPath: string) => {
        setResultSchema(jsonUtils.populateJsonByPath(resultSchema, schemaPath, dataPath));
    }, [resultSchema]);

    return (
        <>
            <TranslateForm
                url={REACT_APP_TRANSLATION_URL || ''}
                marker={REACT_APP_TRANSLATION_MARKER || ''}
                parameter={REACT_APP_TRANSLATION_BODY_PARAMETER || ''}
                body={REACT_APP_TRANSLATION_BODY || ''}
                bodyVariables={['{word}', '{sourceLanguage}', '{targetLanguage}']}
                onDataReceive={(originalResponse: string, data: any) => {
                    setTranslateResponseText(originalResponse);
                    setTranslateResponseJson(data);
                }}
            />
            {translateResponseJson && (
                <TranslationSchema
                    data={translateResponseJson}
                    schema={resultSchema}
                    onDataPathSelect={populateSchemaHandler}
                />
            )}
            {translateResponseText && (
                <Collapsable title="Original response">
                    {translateResponseText}
                </Collapsable>
            )}
        </>
    );
}
