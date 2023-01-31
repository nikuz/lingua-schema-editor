import { ObjectDataString } from './common';

export interface FormField {
    label: string,
    value: string,
    type?: 'text' | 'textarea' | 'select', // text is default
    fullWidth?: boolean,
    variables?: string[],
    variablesError?: boolean,
    variablesValues?: ObjectDataString,
}

export type FormFields = { [name: string]: FormField };