import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './Collapsable.css';

type HeaderSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface Props {
    title: string,
    headerSize?: HeaderSize,
    marginTop?: number,
    marginBottom?: number,
    animated?: boolean,
    children: React.ReactNode,
}

export default function Collapsable(props: Props) {
    const {
        title,
        headerSize,
        marginTop,
        marginBottom,
        animated,
        children,
    } = props;
    const transitionTimeOut = animated !== false ? 200 : 0;

    return (
        <Accordion disableGutters sx={{ mt: marginTop, mb: marginBottom }} TransitionProps={{ timeout: transitionTimeOut }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant={headerSize}>
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails className="collapsable-content">
                {children}
            </AccordionDetails>
        </Accordion>
    );
}