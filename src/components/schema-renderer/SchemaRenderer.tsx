import React from 'react';
import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TranslationSchema } from '../../types';
import SchemaRendererTranslation from './SchemaRendererTranslation';
import SchemaRendererAlternativeTranslations from './SchemaRendererAlternativeTranslations';
import SchemaRendererDefinitions from './SchemaRendererDefinitions';
import SchemaRendererExamples from './SchemaRendererExamples';

interface Props {
    data: any,
    schema: TranslationSchema,
}

export default function SchemaRenderer(props: Props) {
    return (
        <div className="schema-renderer">
            <Typography
                variant="h4"
                sx={{ mt: 3 }}
                gutterBottom
            >
                Preview
            </Typography>
            <SchemaRendererTranslation
                data={props.data}
                schema={props.schema}
            />
            <SchemaRendererAlternativeTranslations
                data={props.data}
                schema={props.schema.alternative_translations}
            />
            <SchemaRendererDefinitions
                data={props.data}
                schema={props.schema.definitions}
            />
            <SchemaRendererExamples
                data={props.data}
                schema={props.schema.examples}
            />
            <Accordion disableGutters sx={{ mt: 2 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography>Schema</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <pre>
                        {JSON.stringify(props.schema, null, 4)}
                    </pre>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
