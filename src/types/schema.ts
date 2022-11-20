import { JSONPath } from './common';

export interface SchemaRenderItem {
    id: string,
    label: string,
    value?: string,
    description?: string,
    fields?: SchemaRenderItem[],
}

export interface SchemaRenderSelectedItem {
    path: string,
    value?: JSONPath,
}
