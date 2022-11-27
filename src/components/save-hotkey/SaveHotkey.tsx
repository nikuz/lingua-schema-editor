import { useEffect, useMemo, useCallback } from 'react';

interface Props {
    onSave: () => void,
}

export default function SaveHotkey(props: Props) {
    const { onSave } = props;
    const isOnMacOs = useMemo(() => navigator.userAgent.indexOf('Mac OS') !== -1, []);

    const saveHandler = useCallback((event: KeyboardEvent) => {
        if (event.key === 's' && ((isOnMacOs && event.metaKey) || (!isOnMacOs && event.ctrlKey))) {
            event.preventDefault();
            onSave();
        }
    }, [isOnMacOs, onSave]);

    useEffect(() => {
        document.addEventListener('keydown', saveHandler);
        return () => document.removeEventListener('keydown', saveHandler);
    }, [saveHandler]);

    return null;
}