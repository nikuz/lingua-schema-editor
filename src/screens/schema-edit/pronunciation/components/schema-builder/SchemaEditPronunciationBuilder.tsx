import { Typography } from '@mui/material';
import { SchemaItem } from 'src/components';
import { TranslationSchemaContext } from 'src/helpers';
import { PronunciationSchemaType } from 'src/types';

interface Props {
    data: any,
    schema: PronunciationSchemaType,
    onDataPathSelect: (schemaPath: string, dataPath: string) => void,
}

export default function SchemaEditPronunciationBuilder(props: Props) {
    const {
        data,
        schema,
        onDataPathSelect,
    } = props;

    return (
        <TranslationSchemaContext.Provider value={{ onDataPathSelect }}>
            <Typography
                variant="h4"
                sx={{ mt: 3 }}
                gutterBottom
            >
                Pronunciation schema
            </Typography>
            <SchemaItem
                title="Value"
                data={data}
                schema={schema}
                schemaPath="data.value"
            />
        </TranslationSchemaContext.Provider>
    );
}
