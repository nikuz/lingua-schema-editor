import {
    Stack,
    Typography,
    ListItem,
} from '@mui/material';
import { TranslationSchemaType, SchemaItemRenderType } from 'src/types';
import { SchemaItem } from 'src/components';

interface Props {
    data: any,
    schema?: TranslationSchemaType,
}

export default function SchemaEditTranslationBuilderTranslations(props: Props) {
    const { data, schema } = props;

    return (
        <Stack spacing={1}>
            <Typography variant="h6" sx={{ mt: 2 }}>Translation</Typography>
            <SchemaItem
                title="Gender"
                renderType={SchemaItemRenderType.list}
                data={data}
                schema={schema}
                schemaPath="translations.value"
                itemRender={(item) => (
                    <TranslationSchemaTranslationGender
                        data={item}
                        schema={schema}
                    />
                )}
            />
        </Stack>
    );
}

function TranslationSchemaTranslationGender(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaItem
                    title="Gender"
                    data={data}
                    schema={schema}
                    schemaPath="translations.gender.value"
                />
                <SchemaItem
                    title="Word"
                    data={data}
                    schema={schema}
                    schemaPath="translations.word.value"
                />
                <SchemaItem
                    title="Sentences"
                    renderType={SchemaItemRenderType.list}
                    data={data}
                    schema={schema}
                    schemaPath="translations.sentences.value"
                    itemRender={(item) => (
                        <TranslationSchemaTranslationGenderSentences
                            data={item}
                            schema={schema}
                        />
                    )}
                />
            </Stack>
        </ListItem>
    );
}

function TranslationSchemaTranslationGenderSentences(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <Stack spacing={1}>
                <SchemaItem
                    title="Word"
                    data={data}
                    schema={schema}
                    schemaPath="translations.sentences.word.value"
                />
            </Stack>
        </ListItem>
    );
}