import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type HeaderSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface Props {
    title: string,
    headerSize?: HeaderSize,
    marginTop?: number,
    marginBottom?: number,
    children: React.ReactNode,
}

export default function Collapsable(props: Props) {
    const {
        title,
        headerSize,
        marginTop,
        marginBottom,
        children,
    } = props;

    return (
        <Accordion disableGutters sx={{ mt: marginTop, mb: marginBottom }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant={headerSize}>
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}