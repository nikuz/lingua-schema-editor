export function getApiUrl() {
    let port = '';
    if (process.env.NODE_ENV === 'development') {
        port = `:${process.env.REACT_APP_SERVER_PORT}`;
    }
    return `//${window.location.hostname}${port}`;
}