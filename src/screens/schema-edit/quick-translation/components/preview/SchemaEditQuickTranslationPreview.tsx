import jmespath from 'jmespath';
import { Typography } from '@mui/material';
import { Collapsable } from 'src/components';
import { QuickTranslationSchemaType } from 'src/types';

interface Props {
    schema: QuickTranslationSchemaType,
    data: any,
}

export default function SchemaEditQuickTranslationPreview(props: Props) {
    const {
        schema,
        data,
    } = props;

    if (!data) {
        return null;
    }

    const sentences = retrieveData(data, schema.sentences?.value);

    return (
        <Collapsable title="Preview" headerSize="h5" marginTop={5} marginBottom={3}>
            {Array.isArray(sentences) && sentences.map((sentence, key) => {
                return (
                    <Typography variant="h4" key={key}>
                        {retrieveData(sentence, schema.sentences?.original_word?.value)}
                        &nbsp;=&nbsp;
                        {retrieveData(sentence, schema.sentences?.translation?.value)}
                    </Typography>
                );
            })}
        </Collapsable>
    );
}

const retrieveData = (source: any, key?: string) => (
    key && jmespath.search(source, key)
);