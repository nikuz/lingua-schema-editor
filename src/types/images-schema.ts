export type ImagesSchemaType = {
    fields: ImagesSchemaTypeFields,
};

export interface ImagesSchemaTypeFields {
    url: string,
    userAgent: string,
    regExp: string,
    minSize: string,
}

export type ImagesSchemaTypeFieldsName = keyof ImagesSchemaTypeFields;