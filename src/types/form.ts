export interface FormField {
    label: string,
    value: string,
    type?: 'text' | 'textarea' | 'select', // text is default
    fullWidth?: boolean,
    variables?: string[],
    variablesError?: boolean,
    variablesValues?: Record<string, string>,
}

export type FormFields = { [name: string]: FormField };