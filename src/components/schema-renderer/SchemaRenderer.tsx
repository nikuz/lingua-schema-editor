import React from 'react';
import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TranslationSchema } from '../../types';
import SchemaRendererDefinitions from './SchemaRendererDefinitions';

interface Props {
    data: any,
    schema: TranslationSchema,
}

export default function SchemaRenderer(props: Props) {
    return (
        <div className="schema-renderer">
            <Typography variant="h4" gutterBottom>Preview</Typography>
            <Accordion disableGutters sx={{ mb: 2 }}>
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
            <SchemaRendererDefinitions
                data={props.data}
                definitionsSchema={props.schema.definitions}
            />
        </div>
    );
}
