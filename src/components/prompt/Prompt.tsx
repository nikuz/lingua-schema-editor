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
    disabled?: boolean,
    children?: React.ReactNode,
    onCancel: () => void,
    onConfirm: () => void,
}

export default function Prompt(props: Props) {
    const {
        isOpen,
        title,
        text,
        disabled,
        children,
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
            {(text || children) && (
                <DialogContent>
                    <DialogContentText>
                        {text}
                    </DialogContentText>
                    {children}
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={onCancel} autoFocus>Cancel</Button>
                <Button onClick={onConfirm} disabled={disabled}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}