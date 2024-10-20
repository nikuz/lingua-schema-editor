export function getApiUrl() {
    let port = '';
    if (import.meta.env.DEV) {
        port = `:${import.meta.env.VITE_SERVER_PORT}`;
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

export function mergeCookie(cookie: (string | string[] | undefined)[]): string[] {
    const cookieList = (cookie.flat().filter(Boolean) as string[]);
    const cookieMap = getCookieMap(cookieList);

    return Array.from(cookieMap.values());
}

export function setCookie(cookie: string[] | string) {
    const cookieList = Array.isArray(cookie) ? cookie : [cookie];
    sessionStorage.setItem('cookie', JSON.stringify(cookieList));
}

export function getCookie(): string[] | undefined {
    const cookie = sessionStorage.getItem('cookie');
    if (cookie) {
        return JSON.parse(cookie);
    }
    return undefined;
}

export function clearCookie() {
    sessionStorage.removeItem('cookie');
}
