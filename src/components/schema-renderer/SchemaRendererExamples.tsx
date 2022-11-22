import React from 'react';
import jmespath from 'jmespath';
import { Typography } from '@mui/material';
import { TranslationSchemaExamples } from '../../types';
import SchemaRendererItem, { SchemaRendererItemType } from './SchemaRendererItem';

interface Props {
    data: any,
    schema?: TranslationSchemaExamples,
}

export default function SchemaRendererExamples(props: Props) {
    const { data, schema } = props;
    const items = schema?.items
        ? jmespath.search(data, schema.items.value)
        : undefined;

    return <>
        <Typography variant="h6" sx={{ mt: 2 }}>Examples</Typography>
        <SchemaRendererItem
            title="Items"
            value={items}
            type={SchemaRendererItemType.list}
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
    const text = schema?.items?.text
        ? jmespath.search(data, schema.items.text.value)
        : undefined;

    return (
        <SchemaRendererItem title="Text" value={text} />
    );
}