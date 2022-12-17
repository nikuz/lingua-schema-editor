import { LanguagesType } from 'src/types';

const languageCodesRegExp = /data:\s?(\[\[\["auto",\s?"Detect language"[^\n]+]]]),/;

export function retrieve(url: string): Promise<LanguagesType> {
    return fetch(url).then(async (response) => {
        const text = await response.text();
        if (response.status === 200) {
            const languageCodesStrings = text.match(languageCodesRegExp);

            if (!languageCodesStrings || !languageCodesStrings[0]) {
                throw new Error('Can\'t retrieve list of languages from server response');
            }

            let languageCodes;
            try {
                languageCodes = JSON.parse(languageCodesStrings[0].replace(languageCodesRegExp, '$1'));
            } catch (e) {
                throw new Error('Can\'t parse retrieved languages as JSON array');
            }

            const supportedLanguages = new Map();

            for (const item of languageCodes[0]) {
                if (item[0] !== 'auto') {
                    supportedLanguages.set(item[0], item[1]);
                }
            }

            return Object.fromEntries(supportedLanguages);
        }
        throw new Error(text || response.status.toString());
    });
}
