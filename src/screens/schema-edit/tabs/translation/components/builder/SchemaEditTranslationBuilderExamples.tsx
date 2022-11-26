import React from 'react';
import { Typography, ListItem } from '@mui/material';
import { TranslationSchemaType } from 'src/types';
import { SchemaItem, SchemaItemRenderType } from 'src/components';

interface Props {
    data: any,
    schema?: TranslationSchemaType,
}

export default function SchemaEditTranslationBuilderExamples(props: Props) {
    const { data, schema } = props;

    return <>
        <Typography variant="h6" sx={{ mt: 2 }}>Examples</Typography>
        <SchemaItem
            title="Examples"
            renderType={SchemaItemRenderType.list}
            data={data}
            schema={schema}
            schemaPath="examples.value"
            itemRender={(item) => (
                <TranslationSchemaExamplesItem
                    data={item}
                    schema={schema}
                />
            )}
        />
    </>;
}

function TranslationSchemaExamplesItem(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <SchemaItem
                title="Text"
                data={data}
                schema={schema}
                schemaPath="examples.text.value"
            />
        </ListItem>
    );
}