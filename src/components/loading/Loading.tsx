import React from 'react';
import cl from 'classnames';
import { CircularProgress } from '@mui/material';
import './Loading.css';

interface Props {
    blocker?: boolean,
}

export default function Loading(props: Props) {
    const { blocker } = props;
    const className = cl('loading-container flex flex-center', { blocker });

    return (
        <div className={className}>
            <CircularProgress />
        </div>
    )
}
