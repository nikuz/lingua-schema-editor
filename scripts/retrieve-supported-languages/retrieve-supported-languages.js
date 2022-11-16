const fs = require('node:fs');
const path = require('node:path');

const dataFilePath = path.resolve(__dirname, 'google-translate-response.html');
const resultFilePath = path.resolve(__dirname, 'supported-languages.json');
const languageCodesRegExp = /data: (\[\[\["auto", "Detect language"[^\n]+]]]),/;

if (!fs.existsSync(dataFilePath)) {
    throw new Error('No "google-translate-response.html" file exists in the script directory');
}
const fileContent = fs.readFileSync(dataFilePath).toString();
const languageCodesStrings = fileContent.match(languageCodesRegExp);

if (!languageCodesStrings || !languageCodesStrings[0]) {
    throw new Error('Can\'t find list of languages in the input file');
}

let languageCodes;
try {
    languageCodes = JSON.parse(languageCodesStrings[0].replace(languageCodesRegExp, '$1'));
} catch (e) {
    throw new Error('Can\'t parse retrieved languages as JSON array');
}


const supportedLanguagesMap = new Map();

for (const item of languageCodes[0]) {
    if (item[0] !== 'auto') {
        supportedLanguagesMap.set(item[0], item[1]);
    }
}

const supportedLanguagesList = [];

for (const item of supportedLanguagesMap) {
    supportedLanguagesList.push({
        id: item[0],
        value: item[1],
    });
}

fs.writeFileSync(resultFilePath, JSON.stringify(supportedLanguagesList, null, 4));
