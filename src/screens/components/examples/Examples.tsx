import React from 'react';
import {
    TextField,
    List,
    ListItem,
    Divider,
} from '@mui/material';

export default function Examples() {
    return (
        <div className="form-row">
            <Divider textAlign="left" sx={{ pb: 1 }}>Examples</Divider>
            <TextField
                variant="outlined"
                label="Examples"
                size="small"
                fullWidth
                value=""
            />
            <List component="div" disablePadding>
                <ListItem sx={{ pt: 2 }}>
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
                        label="Text"
                        size="small"
                        value=""
                    />
                </ListItem>
            </List>
        </div>
    );
}
