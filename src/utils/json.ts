export function findAllJsonStrings(json: JSON, result?: string[]): string[] {
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
