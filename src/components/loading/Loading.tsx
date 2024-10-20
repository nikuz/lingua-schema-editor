import cl from 'classnames';
import { CircularProgress } from '@mui/material';
import './Loading.css';

interface Props {
    blocker?: boolean,
    fixed?: boolean,
}

export default function Loading(props: Props) {
    const { blocker, fixed } = props;
    const className = cl('loading-container flex flex-center', { blocker, fixed });

    return (
        <div className={className}>
            <CircularProgress />
        </div>
    );
}
