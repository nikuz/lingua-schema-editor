import { FieldsItem } from '../../../types';

const schema: FieldsItem[] = [{
    id: 'examples',
    label: 'Examples',
    fields: [{
        id: 'items',
        label: 'Items',
        fields: [{
            id: 'text',
            label: 'Text',
        }],
    }],
}];

export default schema;
