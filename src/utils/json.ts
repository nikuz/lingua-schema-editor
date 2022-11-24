export function findAllJsonStrings(json: any, result?: string[]): string[] {
    const strings = result || [];
    const values = Object.values(json);

    for (let item of values) {
        if (typeof item === 'object' && item !== null) {
            findAllJsonStrings(item, strings);
        } else if (typeof item === 'string' && item.indexOf('"') !== -1) {
            strings.push(item);
        }
    }

    // sort descending by length
    strings.sort((a: string, b: string) => b.length - a.length);

    return strings;
}

export function populateJsonByPath(json: any, path: string, value: string): any {
    // deep copy
    const result = JSON.parse(JSON.stringify(json));
    const pathParts = path.split('.');
    let pointer = result;

    for (let i = 0, l = pathParts.length; i < l; i++) {
        const part = pathParts[i];
        if (!pointer[part]) {
            pointer[part] = {};
        }
        if (i === l - 1) {
            pointer[part] = value;
            break;
        }
        pointer = pointer[part];
    }

    return result;
}