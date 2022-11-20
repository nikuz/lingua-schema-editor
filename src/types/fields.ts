export interface FieldsItem {
    id: string,
    label: string,
    value?: string,
    description?: string,
    fields?: FieldsItem[],
}

export interface FieldsSelectedItem {
    path: string,
    value?: string,
}
