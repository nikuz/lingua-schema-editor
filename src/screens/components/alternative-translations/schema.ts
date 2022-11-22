import { FieldsItem } from '../../../types';

const schema: FieldsItem[] = [{
    id: 'alternative_translations',
    label: 'Alternative translations',
    fields: [{
        id: 'speech_part',
        label: 'Speech part',
        description: 'Noun, Verb, etc.',
    }, {
        id: 'items',
        label: 'Items',
        fields: [{
            id: 'translation',
            label: 'Translation',
        }, {
            id: 'words',
            label: 'Words',
        }, {
            id: 'frequency',
            label: 'Frequency',
            description: 'Smaller is better',
        }],
    }],
}];

export default schema;
