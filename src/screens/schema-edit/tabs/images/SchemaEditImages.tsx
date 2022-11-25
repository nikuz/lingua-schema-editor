import React, { useState, useCallback } from 'react';
import { Form } from '../../../../components';
import { imagesController } from '../../../../controllers';
import { FormFields } from '../../../../types';
import './SchemaEditImages.css';

const {
    REACT_APP_IMAGE_URL,
    REACT_APP_IMAGE_USER_AGENT,
    REACT_APP_IMAGE_REG_EXP,
    REACT_APP_IMAGE_MIN_SIZE,
} = process.env;

export default function SchemaEditImages() {
    const [fields, setFields] = useState<FormFields>({
        url: {
            label: 'Url',
            value: REACT_APP_IMAGE_URL || '',
            fullWidth: true,
            variables: ['{word}'],
        },
        userAgent: {
            label: 'User Agent',
            value: REACT_APP_IMAGE_USER_AGENT || '',
            fullWidth: true,
        },
        regexp: {
            label: 'RegExp',
            value: REACT_APP_IMAGE_REG_EXP || '',
        },
        size: {
            label: 'Min base64 image size',
            value: REACT_APP_IMAGE_MIN_SIZE || '',
        },
    });
    const [images, setImages] = useState<string[]>([]);

    const requestHandler = useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {

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
                const regExp = new RegExp(fields.regexp.value, 'g');
                const imagesMatch = response.match(regExp);
                if (imagesMatch) {
                    const validImages: string[] = [];
                    const minSize = Number(fields.size.value);
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
    }, [fields]);

    return <>
        <Form
            fields={fields}
            onChange={setFields}
            onSubmit={requestHandler}
        />
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
    </>;
}
