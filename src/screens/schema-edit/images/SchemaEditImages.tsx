import React, {useState, useCallback, useEffect} from 'react';
import { useOutletContext } from 'react-router-dom';
import { Form, Collapsable } from 'src/components';
import { imagesController } from 'src/controllers';
import {
    FormFields,
    ImagesSchemaTypeFieldsName,
} from 'src/types';
import {
    SchemaEditCache,
    SchemaEditCacheKeys,
    SetSchemaEditCacheCallback,
} from '../types';
import SchemaEditImagesPreview from './components/preview';
import './SchemaEditImages.css';

const {
    REACT_APP_IMAGE_URL,
    REACT_APP_IMAGE_USER_AGENT,
    REACT_APP_IMAGE_REG_EXP,
    REACT_APP_IMAGE_MIN_SIZE,
    REACT_APP_IMAGE_SAFE_SEARCH_URL,
    REACT_APP_IMAGE_SAFE_SEARCH_SIGNATURE_REG_EXP,
} = process.env;

export default function SchemaEditImages() {
    const [cache, setCache]: [SchemaEditCache, SetSchemaEditCacheCallback] = useOutletContext();
    const [fields, setFields] = useState<FormFields>({
        url: {
            label: 'URL',
            value: cache.images.schema?.fields.url || REACT_APP_IMAGE_URL || '',
            fullWidth: true,
            variables: ['{word}'],
        },
        userAgent: {
            label: 'User Agent',
            value: cache.images.schema?.fields.userAgent || REACT_APP_IMAGE_USER_AGENT || '',
            fullWidth: true,
        },
        regExp: {
            label: 'RegExp',
            value: cache.images.schema?.fields.regExp || REACT_APP_IMAGE_REG_EXP || '',
        },
        minSize: {
            label: 'Min base64 image size',
            value: cache.images.schema?.fields.minSize || REACT_APP_IMAGE_MIN_SIZE || '',
        },
        safeSearchUrl: {
            label: 'Safe search URL',
            value: cache.images.schema?.fields.safeSearchUrl || REACT_APP_IMAGE_SAFE_SEARCH_URL || '',
            fullWidth: true,
        },
        safeSearchSignatureRegExp: {
            label: 'Safe search signature RegExp',
            value: cache.images.schema?.fields.safeSearchSignatureRegExp || REACT_APP_IMAGE_SAFE_SEARCH_SIGNATURE_REG_EXP || '',
        },
    });

    const setFieldsHandler = useCallback((fields: FormFields) => {
        setFields(fields);
        setCache(SchemaEditCacheKeys.images, {
            ...cache.images,
            schema: {
                ...cache.images.schema,
                fields: {
                    url: fields.url.value,
                    userAgent: fields.userAgent.value,
                    regExp: fields.regExp.value,
                    minSize: fields.minSize.value,
                    safeSearchUrl: fields.safeSearchUrl.value,
                    safeSearchSignatureRegExp: fields.safeSearchSignatureRegExp.value,
                },
            },
        });
    }, [cache, setCache]);

    const requestHandler = useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {
            setCache(SchemaEditCacheKeys.images, {
                ...cache.images,
                images: [],
            });

            let url = fields.url.value;
            const urlVariables = fields.url.variablesValues;

            if (urlVariables) {
                Object.keys(urlVariables).forEach((key) => {
                    url = url.replace(key, urlVariables[key]);
                });
            }

            imagesController.get({
                url,
                userAgent: fields.userAgent.value,
            }).then(response => {
                const regExp = new RegExp(fields.regExp.value, 'g');
                const imagesMatch = response.match(regExp);
                if (imagesMatch) {
                    const validImages: string[] = [];
                    const minSize = Number(fields.minSize.value);
                    imagesMatch.forEach(item => {
                        const content = item.replace(regExp, '$1');
                        if (content.length >= minSize) {
                            const sanitiseContent = content
                                .replace(/\\/g, '')
                                .replace(/\\x3d/g, '=');
                            validImages.push(sanitiseContent);
                        }
                    });

                    if (validImages.length) {
                        setCache(SchemaEditCacheKeys.images, {
                            ...cache.images,
                            images: validImages,
                        });
                        resolve();
                    } else {
                        reject(new Error('No large images match MIN size'));
                    }
                } else {
                    reject(new Error('No images match provided RegExp'));
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }, [fields, cache, setCache]);

    // set fields values from cloud
    useEffect(() => {
        const schemaFields = cache.images.schema?.fields;
        if (!cache.images.initiated && schemaFields) {
            const fieldsClone = { ...fields };
            Object.keys(schemaFields).forEach(item => {
                const key = item as ImagesSchemaTypeFieldsName;
                if (fieldsClone[key]) {
                    fieldsClone[key].value = schemaFields[key];
                }
            });
            setFields(fieldsClone);
            setCache(SchemaEditCacheKeys.images, {
                ...cache.images,
                initiated: true,
            });
        }
    }, [fields, cache, setCache]);

    return <>
        <Form
            fields={fields}
            onChange={setFieldsHandler}
            onSubmit={requestHandler}
        />
        <Collapsable title="Schema" headerSize="h5" marginTop={5} marginBottom={3}>
            <pre>
                {JSON.stringify(cache.images.schema || {}, null, 4)}
            </pre>
        </Collapsable>
        <SchemaEditImagesPreview images={cache.images.images || []} />
    </>;
}
