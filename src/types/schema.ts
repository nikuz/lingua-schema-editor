export interface SchemaRenderItem {
    id: string,
    label: string,
    value?: string,
    description?: string,
    fields?: SchemaRenderItem[],
}
