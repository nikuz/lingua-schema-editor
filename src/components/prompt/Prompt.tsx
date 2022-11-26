import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

interface Props {
    isOpen: boolean,
    title: string,
    text?: string,
    onCancel: () => void,
    onConfirm: () => void,
}

export default function Prompt(props: Props) {
    const {
        isOpen,
        title,
        text,
        onCancel,
        onConfirm,
    } = props;

    return (
        <Dialog
            open={isOpen}
            onClose={onCancel}
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            {text && (
                <DialogContent>
                    <DialogContentText>
                        {text}
                    </DialogContentText>
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={onCancel} autoFocus>Cancel</Button>
                <Button onClick={onConfirm}>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    );
}