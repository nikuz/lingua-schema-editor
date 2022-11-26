import React, { useState, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Form, Collapsable } from 'src/components';
import { imagesController } from 'src/controllers';
import {
    FormFields,
    ImagesSchemaType,
} from 'src/types';
import {
    SchemaEditCache,
    SchemaEditCacheKeys,
    SetSchemaEditCacheCallback,
} from '../../types';
import SchemaEditImagesPreview from './components/preview';
import './SchemaEditImages.css';

const {
    REACT_APP_IMAGE_URL,
    REACT_APP_IMAGE_USER_AGENT,
    REACT_APP_IMAGE_REG_EXP,
    REACT_APP_IMAGE_MIN_SIZE,
} = process.env;

export default function SchemaEditImages() {
    const [cache, setCache]: [SchemaEditCache, SetSchemaEditCacheCallback] = useOutletContext();
    const defaultSchema = useMemo<ImagesSchemaType>(() => ({
        fields: {
            url: REACT_APP_IMAGE_URL || '',
            userAgent: REACT_APP_IMAGE_USER_AGENT || '',
            regExp: REACT_APP_IMAGE_REG_EXP || '',
            minSize: REACT_APP_IMAGE_MIN_SIZE || '',
        },
    }), []);
    const [fields, setFields] = useState<FormFields>({
        url: {
            label: 'Url',
            value: defaultSchema.fields.url,
            fullWidth: true,
            variables: ['{word}'],
        },
        userAgent: {
            label: 'User Agent',
            value: defaultSchema.fields.userAgent,
            fullWidth: true,
        },
        regExp: {
            label: 'RegExp',
            value: defaultSchema.fields.regExp,
        },
        minSize: {
            label: 'Min base64 image size',
            value: defaultSchema.fields.minSize,
        },
    });
    const [images, setImages] = useState<string[]>(cache.images.images || []);
    const [imagesSchema, setImagesSchema] = useState<ImagesSchemaType>({
        ...defaultSchema,
        ...cache.images.schema,
    });

    const setFieldsHandler = useCallback((fields: FormFields) => {
        setFields(fields);
        const schemaClone: ImagesSchemaType = {
            ...imagesSchema,
            fields: {
                url: fields.url.value,
                userAgent: fields.userAgent.value,
                regExp: fields.regExp.value,
                minSize: fields.minSize.value,
            },
        };
        setImagesSchema(schemaClone);
        setCache(SchemaEditCacheKeys.images, {
            ...cache.images,
            schema: schemaClone,
        });
    }, [imagesSchema, cache, setCache]);

    const requestHandler = useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {
            setImages([]);
            setCache(SchemaEditCacheKeys.images, {
                ...cache.images,
                schema: {
                    fields: imagesSchema.fields,
                },
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
                        setImages(validImages);
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
    }, [fields, imagesSchema, cache, setCache]);

    return <>
        <Form
            fields={fields}
            onChange={setFieldsHandler}
            onSubmit={requestHandler}
        />
        <Collapsable title="Schema" headerSize="h5" marginTop={5} marginBottom={3}>
            <pre>
                {JSON.stringify(imagesSchema, null, 4)}
            </pre>
        </Collapsable>
        <SchemaEditImagesPreview images={images} />
    </>;
}
