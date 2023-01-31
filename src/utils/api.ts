export function getApiUrl() {
    let port = '';
    if (process.env.NODE_ENV === 'development') {
        port = `:${process.env.REACT_APP_SERVER_PORT}`;
    }
    return `//${window.location.hostname}${port}`;
}

export function getCookieMap(cookie: string | string[]) {
    const cookieList = Array.isArray(cookie) ? cookie : [cookie];
    const cookieMap = new Map();

    for (const cookie of cookieList) {
        const parts = cookie.split(';');
        const nameParts = parts[0].split('=');
        const name = nameParts[0];
        cookieMap.set(name, cookie);
    }

    return cookieMap;
}

export function mergeCookie(cookie: ((string & any[]) | string[])[]): string[] {
    const cookieList = cookie.flat();
    const cookieMap = getCookieMap(cookieList);

    return Array.from(cookieMap.values());
}