export type ImagesSchemaType = {
    fields: ImagesSchemaTypeFields,
};

export interface ImagesSchemaTypeFields {
    url: string,
    userAgent: string,
    regExp: string,
    minSize: string,
    safeSearchUrl: string,
    safeSearchSignatureRegExp: string,
}

export type ImagesSchemaTypeFieldsName = keyof ImagesSchemaTypeFields;