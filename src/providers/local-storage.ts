export function getItem(name: string) {
    return window.localStorage.getItem(name);
}

export function setItem(name: string, value: string) {
    return window.localStorage.setItem(name, value);
}

export function removeItem(name: string) {
    return window.localStorage.removeItem(name);
}

export function clear() {
    return window.localStorage.clear();
}
