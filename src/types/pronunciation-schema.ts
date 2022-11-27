import { SchemaItemType } from './schema-item';

export type PronunciationSchemaType = {
    fields: PronunciationSchemaTypeFields,
    data?: SchemaItemType,
};

export interface PronunciationSchemaTypeFields {
    url: string,
    parameter: string,
    body: string,
    marker: string,
    base64Prefix: string,
}

export type PronunciationSchemaTypeFieldsName = keyof PronunciationSchemaTypeFields;