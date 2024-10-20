import { useState, useCallback, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Collapsable,
    Form,
} from 'src/components';
import { translationController, useAuthTokenId } from 'src/controllers';
import { jsonUtils } from 'src/utils';
import {
    FormFields,
    QuickTranslationSchemaType,
    QuickTranslationSchemaTypeFieldsName,
    LanguagesType,
    SchemaEditCache,
    SchemaEditCacheKeys,
    SetSchemaEditCacheCallback,
} from 'src/types';
import SchemaEditQuickTranslationBuilder from './components/schema-builder';
import SchemaEditQuickTranslationPreview from './components/preview';

const { VITE_QUICK_TRANSLATION_URL } = import.meta.env;

export default function SchemaEditQuickTranslation() {
    const [userTokenId] = useAuthTokenId();
    const [cache, setCache, languages]: [SchemaEditCache, SetSchemaEditCacheCallback, LanguagesType] = useOutletContext();
    const [fields, setFields] = useState<FormFields>({
        url: {
            label: 'Url',
            value: cache.quick_translation.schema?.fields.url || VITE_QUICK_TRANSLATION_URL || '',
            fullWidth: true,
            variables: ['{word}', '{sourceLanguage}', '{targetLanguage}'],
        }
    });

    const setFieldsHandler = useCallback((fields: FormFields) => {
        setFields(fields);
        setCache(SchemaEditCacheKeys.quick_translation, {
            ...cache.quick_translation,
            schema: {
                ...cache.quick_translation.schema,
                fields: {
                    url: fields.url.value,
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
            if (cache.quick_translation.responseText && cache.quick_translation.responseJson) {
                setCache(SchemaEditCacheKeys.quick_translation, {
                    ...cache.quick_translation,
                    responseText: undefined,
                    responseJson: undefined,
                });
            }

            let url = fields.url.value;
            const urlVariables = fields.url.variablesValues;

            if (urlVariables) {
                Object.keys(urlVariables).forEach((key) => {
                    url = url.replace(key, urlVariables[key]);
                });
            }

            translationController.translate({
                url,
                token: userTokenId,
            }).then(response => {
                const responseJson = JSON.parse(response);
                setCache(SchemaEditCacheKeys.quick_translation, {
                    ...cache.quick_translation,
                    responseJson,
                    responseText: response,
                });
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }, [userTokenId, fields, cache, setCache]);

    const populateSchemaHandler = useCallback((schemaPath: string, dataPath: string) => {
        const schema = jsonUtils.populateJsonByPath(cache.quick_translation.schema || {}, schemaPath, dataPath);
        setCache(SchemaEditCacheKeys.quick_translation, {
            ...cache.quick_translation,
            schema,
        });
    }, [cache, setCache]);

    // set fields values from cloud
    useEffect(() => {
        const schemaFields = cache.quick_translation.schema?.fields;
        if (!cache.quick_translation.initiated && schemaFields) {
            const fieldsClone = { ...fields };
            Object.keys(schemaFields).forEach(item => {
                const key = item as QuickTranslationSchemaTypeFieldsName;
                if (fieldsClone[key]) {
                    fieldsClone[key].value = schemaFields[key];
                }
            });
            setFields(fieldsClone);
            setCache(SchemaEditCacheKeys.quick_translation, {
                ...cache.quick_translation,
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
            <SchemaEditQuickTranslationBuilder
                data={cache.quick_translation.responseJson}
                schema={cache.quick_translation.schema || {} as QuickTranslationSchemaType}
                onDataPathSelect={populateSchemaHandler}
            />
            <SchemaEditQuickTranslationPreview
                schema={cache.quick_translation.schema || {} as QuickTranslationSchemaType}
                data={cache.quick_translation.responseJson}
            />
            <Collapsable title="JSON Schema" headerSize="h5" marginBottom={3}>
                <pre>
                    {JSON.stringify(cache.quick_translation.schema || {}, null, 4)}
                </pre>
            </Collapsable>
            {cache.quick_translation.responseText && (
                <Collapsable title="Original response" headerSize="h5">
                    {cache.quick_translation.responseText}
                </Collapsable>
            )}
        </>
    );
}
