import { SchemaItemType } from './schema-item';

export type PronunciationSchemaType = {
    url: string,
    parameter: string,
    body: string,
    marker: string,
    base64Prefix: string,
    data?: SchemaItemType,
};