export function getApiUrl() {
    return `//${window.location.hostname}:${process.env.REACT_APP_SERVER_PORT}`;
}