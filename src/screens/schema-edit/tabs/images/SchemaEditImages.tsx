import React, { useState, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { Form, Collapsable } from 'src/components';
import { imagesController } from 'src/controllers';
import { FormFields, ImagesSchemaType } from 'src/types';
import './SchemaEditImages.css';

const {
    REACT_APP_IMAGE_URL,
    REACT_APP_IMAGE_USER_AGENT,
    REACT_APP_IMAGE_REG_EXP,
    REACT_APP_IMAGE_MIN_SIZE,
} = process.env;

export default function SchemaEditImages() {
    const defaultSchema = useMemo<ImagesSchemaType>(() => ({
        url: REACT_APP_IMAGE_URL || '',
        userAgent: REACT_APP_IMAGE_USER_AGENT || '',
        regExp: REACT_APP_IMAGE_REG_EXP || '',
        minSize: REACT_APP_IMAGE_MIN_SIZE || '',
    }), []);
    const [fields, setFields] = useState<FormFields>({
        url: {
            label: 'Url',
            value: defaultSchema.url,
            fullWidth: true,
            variables: ['{word}'],
        },
        userAgent: {
            label: 'User Agent',
            value: defaultSchema.userAgent,
            fullWidth: true,
        },
        regExp: {
            label: 'RegExp',
            value: defaultSchema.regExp,
        },
        minSize: {
            label: 'Min base64 image size',
            value: defaultSchema.minSize,
        },
    });
    const [images, setImages] = useState<string[]>([]);
    const [resultSchema, setResultSchema] = useState<ImagesSchemaType>(defaultSchema);

    const setFieldsHandler = useCallback((fields: FormFields) => {
        setFields(fields);
        setResultSchema({
            ...resultSchema,
            url: fields.url.value,
            userAgent: fields.userAgent.value,
            regExp: fields.regExp.value,
            minSize: fields.minSize.value,
        });
    }, [resultSchema]);

    const requestHandler = useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {
            setResultSchema(defaultSchema);
            setImages([]);

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
    }, [defaultSchema, fields]);

    return <>
        <Form
            fields={fields}
            onChange={setFieldsHandler}
            onSubmit={requestHandler}
        />
        <Collapsable title="Schema" headerSize="h5" marginTop={5}>
            <pre>
                {JSON.stringify(resultSchema, null, 4)}
            </pre>
        </Collapsable>
        <Box sx={{ mt: 4 }}>
            {images.map((item, key) => {
                return (
                    <div className="image" key={key}>
                        <img
                            src={`${item}`}
                            alt=""
                            loading="lazy"
                        />
                    </div>
                );
            })}
        </Box>
    </>;
}
