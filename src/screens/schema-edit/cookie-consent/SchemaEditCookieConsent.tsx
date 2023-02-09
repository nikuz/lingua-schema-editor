import React, { useState, useCallback, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Collapsable,
    Form,
} from 'src/components';
import { consentController, useAuthTokenId } from 'src/controllers';
import {
    FormFields,
    LanguagesType,
    CookieConsentSchemaTypeFieldsName,
    SchemaEditCache,
    SchemaEditCacheKeys,
    SetSchemaEditCacheCallback,
} from 'src/types';
import SchemaEditCookieConsentPreview from './components/preview';

const {
    REACT_APP_COOKIE_CONSENT_MARKER,
    REACT_APP_COOKIE_CONSENT_FORM_REG_EXP,
    REACT_APP_COOKIE_CONSENT_INPUT_REG_EXP,
} = process.env;

export default function SchemaEditCookieConsent() {
    const [userTokenId] = useAuthTokenId();
    const [cache, setCache, languages]: [SchemaEditCache, SetSchemaEditCacheCallback, LanguagesType] = useOutletContext();
    const [fields, setFields] = useState<FormFields>({
        marker: {
            label: 'Marker',
            value: cache.cookie_consent.schema?.fields.marker || REACT_APP_COOKIE_CONSENT_MARKER || '',
        },
        formRegExp: {
            label: 'Form RegExp',
            value: cache.cookie_consent.schema?.fields.formRegExp || REACT_APP_COOKIE_CONSENT_FORM_REG_EXP || '',
        },
        inputRegExp: {
            label: 'Input RegExp',
            value: cache.cookie_consent.schema?.fields.inputRegExp || REACT_APP_COOKIE_CONSENT_INPUT_REG_EXP || '',
        },
    });

    const setFieldsHandler = useCallback((fields: FormFields) => {
        setFields(fields);
        setCache(SchemaEditCacheKeys.cookie_consent, {
            ...cache.cookie_consent,
            schema: {
                ...cache.cookie_consent.schema,
                fields: {
                    marker: fields.marker.value,
                    formRegExp: fields.formRegExp.value,
                    inputRegExp: fields.inputRegExp.value,
                },
            },
        });
    }, [cache, setCache]);

    const requestHandler = useCallback((): Promise<void> => {
        if (!userTokenId) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            // clear response text and json states
            if (cache.cookie_consent.responseText) {
                setCache(SchemaEditCacheKeys.cookie_consent, {
                    ...cache.cookie_consent,
                    responseText: undefined,
                });
            }

            consentController.getPageContent({
                token: userTokenId,
                marker: fields.marker.value,
            }).then(response => {
                const form = response.match(new RegExp(fields.formRegExp.value));
                let inputs;

                if (form) {
                    inputs = form[0].match(new RegExp(fields.inputRegExp.value, 'g'));
                }

                setCache(SchemaEditCacheKeys.cookie_consent, {
                    ...cache.cookie_consent,
                    responseText: response,
                    form: form?.[0],
                    inputs: inputs ? Array.from(inputs) : undefined,
                });
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }, [userTokenId, fields, cache, setCache]);

    // set fields values from cloud
    useEffect(() => {
        const schemaFields = cache.cookie_consent.schema?.fields;
        if (!cache.cookie_consent.initiated && schemaFields) {
            const fieldsClone = { ...fields };
            Object.keys(schemaFields).forEach(item => {
                const key = item as CookieConsentSchemaTypeFieldsName;
                if (fieldsClone[key]) {
                    fieldsClone[key].value = schemaFields[key];
                }
            });
            setFields(fieldsClone);
            setCache(SchemaEditCacheKeys.cookie_consent, {
                ...cache.cookie_consent,
                initiated: true,
            });
        }
    }, [fields, cache, setCache]);

    return (
        <>
            <Form
                fields={fields}
                languages={languages}
                onChange={setFieldsHandler}
                onSubmit={requestHandler}
            />
            <SchemaEditCookieConsentPreview
                form={cache.cookie_consent.form}
                inputs={cache.cookie_consent.inputs}
            />
            <Collapsable title="JSON Schema" headerSize="h5" marginBottom={3}>
                <pre>
                    {JSON.stringify(cache.cookie_consent.schema || {}, null, 4)}
                </pre>
            </Collapsable>
            {cache.cookie_consent.responseText && (
                <Collapsable title="Original response" headerSize="h5" animated={false}>
                    {cache.cookie_consent.responseText}
                </Collapsable>
            )}
        </>
    );
}
