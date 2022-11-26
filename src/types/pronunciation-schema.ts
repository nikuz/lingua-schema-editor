import { SchemaItemType } from './schema-item';

export type PronunciationSchemaType = {
    fields: {
        url: string,
        parameter: string,
        body: string,
        marker: string,
        base64Prefix: string,
    },
    data?: SchemaItemType,
};