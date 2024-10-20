import {
    Typography,
    List,
    ListItem,
} from '@mui/material';
import { Collapsable } from 'src/components';

interface Props {
    form?: string,
    inputs?: string[],
}

export default function SchemaEditCookieConsent(props: Props) {
    const {
        form,
        inputs,
    } = props;
    if (!form || !inputs) {
        return null;
    }

    return (
        <Collapsable title="Preview" headerSize="h5" marginTop={5} marginBottom={3}>
            <Typography variant="h6">Form</Typography>
            <div>{form}</div>
            <Typography variant="h6" sx={{ mt: 2 }}>Inputs</Typography>
            <List>
                {inputs.map((item, key) => (
                    <ListItem key={key}>
                        {item}
                    </ListItem>
                ))}
            </List>
        </Collapsable>
    );
}