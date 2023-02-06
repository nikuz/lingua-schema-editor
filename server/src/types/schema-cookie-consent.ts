export interface CookieConsentSchemaType {
    fields: CookieConsentSchemaTypeFields,
}

export interface CookieConsentSchemaTypeFields {
    marker: string,
    formRegExp: string,
    inputRegExp: string,
}

export type CookieConsentSchemaTypeFieldsName = keyof CookieConsentSchemaTypeFields;