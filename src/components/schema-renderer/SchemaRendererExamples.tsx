import React from 'react';
import { Typography, ListItem } from '@mui/material';
import { TranslationSchema } from '../../types';
import SchemaRendererItem, { SchemaRendererItemType } from './SchemaRendererItem';

interface Props {
    data: any,
    schema?: TranslationSchema,
}

export default function SchemaRendererExamples(props: Props) {
    const { data, schema } = props;

    return <>
        <Typography variant="h6" sx={{ mt: 2 }}>Examples</Typography>
        <SchemaRendererItem
            title="Examples"
            type={SchemaRendererItemType.list}
            data={data}
            schema={schema}
            schemaPath="examples.value"
            itemRender={(item) => (
                <SchemaRendererExamplesItem
                    data={item}
                    schema={schema}
                />
            )}
        />
    </>;
}

function SchemaRendererExamplesItem(props: Props) {
    const { data, schema } = props;

    return (
        <ListItem sx={{ pl: 3 }}>
            <SchemaRendererItem
                title="Text"
                data={data}
                schema={schema}
                schemaPath="examples.text.value"
            />
        </ListItem>
    );
}