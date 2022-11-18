import React from 'react';
import {
    TextField,
    List,
    ListItem,
    Divider,
} from '@mui/material';

export default function Definitions() {
    return (
        <div className="form-row">
            <Divider textAlign="left" sx={{ pb: 1 }}>Definitions</Divider>
            <TextField
                variant="outlined"
                label="Definitions"
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
                        label="Group type"
                        size="small"
                        value=""
                        helperText="Informal, etc."
                    />
                </ListItem>
                <ListItem>
                    <TextField
                        variant="outlined"
                        label="Group items"
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
                <ListItem sx={{ pl: 5 }}>
                    <TextField
                        variant="outlined"
                        label="Example"
                        size="small"
                        value=""
                    />
                </ListItem>
                <ListItem sx={{ pl: 5 }}>
                    <TextField
                        variant="outlined"
                        label="Definition type"
                        size="small"
                        value=""
                        helperText="Mathematics, etc."
                    />
                </ListItem>
                <ListItem sx={{ pl: 5 }}>
                    <TextField
                        variant="outlined"
                        label="Synonyms"
                        size="small"
                        value=""
                    />
                </ListItem>
            </List>
            <List component="div" disablePadding>
                <ListItem sx={{ pl: 8 }}>
                    <TextField
                        variant="outlined"
                        label="Type"
                        size="small"
                        value=""
                    />
                </ListItem>
                <ListItem sx={{ pl: 8 }}>
                    <TextField
                        variant="outlined"
                        label="Synonym items"
                        size="small"
                        value=""
                    />
                </ListItem>
            </List>
            <List component="div" disablePadding>
                <ListItem sx={{ pl: 11 }}>
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
