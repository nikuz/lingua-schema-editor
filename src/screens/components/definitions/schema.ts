import { FieldsItem } from '../../../types';

const schema: FieldsItem[] = [{
    id: 'definitions',
    label: 'Definitions',
    fields: [{
        id: 'speech_part',
        label: 'Speech part',
        description: 'Noun, Verb, etc.',
    }, {
        id: 'type',
        label: 'Type',
        description: 'Informal, etc.',
    }, {
        id: 'items',
        label: 'Items',
        fields: [{
            id: 'text',
            label: 'Text',
        }, {
            id: 'example',
            label: 'Example',
        }, {
            id: 'type',
            label: 'Type',
            description: 'Mathematics, etc.',
        }, {
            id: 'synonyms',
            label: 'Synonyms',
            fields: [{
                id: 'type',
                label: 'Type',
                description: 'Archaic, informal, etc.',
            }, {
                id: 'items',
                label: 'Items',
                fields: [
                    {
                        id: 'text',
                        label: 'Text',
                    }
                ],
            }],
        }],
    }],
}];

export default schema;
