const { REACT_APP_SERVER_PORT } = process.env;

export function getApiUrl() {
    const port = process.env.NODE_ENV === 'development' ? `:${REACT_APP_SERVER_PORT}` : '';
    return `//${window.location.hostname}${port}`;
}
