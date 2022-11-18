import React from 'react';
import {
    TextField,
    List,
    ListItem,
    Divider,
} from '@mui/material';

export default function AlternativeTranslations() {
    return (
        <div className="form-row">
            <Divider textAlign="left" sx={{ pb: 1 }}>Alternative translations</Divider>
            <TextField
                variant="outlined"
                label="Alternative translations"
                size="small"
                fullWidth
                value=""
            />
            <List component="div" disablePadding>
                <ListItem sx={{ pt: 2 }}>
                    <TextField
                        variant="outlined"
                        label="Speech part"
                        size="small"
                        value=""
                        helperText="Noun, Verb, etc."
                    />
                </ListItem>
                <ListItem>
                    <TextField
                        variant="outlined"
                        label="Items"
                        size="small"
                        value=""
                    />
                </ListItem>
            </List>
            <List component="div" disablePadding>
                <ListItem sx={{ pl: 5 }}>
                    <TextField
                        variant="outlined"
                        label="Translation"
                        size="small"
                        value=""
                    />
                </ListItem>
                <ListItem sx={{ pl: 5 }}>
                    <TextField
                        variant="outlined"
                        label="Words"
                        size="small"
                        value=""
                    />
                </ListItem>
                <ListItem sx={{ pl: 5 }}>
                    <TextField
                        variant="outlined"
                        label="Frequency"
                        size="small"
                        value=""
                        helperText="Smaller is better"
                    />
                </ListItem>
            </List>
        </div>
    );
}
