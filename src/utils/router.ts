export function setParams(url: string, params: string[], values: (string | undefined)[]): string {
    return params.reduce(
        (acc, param, index) => acc.replace(param, values[index] || ''),
        url
    );
}