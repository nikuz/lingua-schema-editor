const {
    aliasWebpack,
    configPaths,
} = require('react-app-alias');
const aliasMap = configPaths('./tsconfig.paths.json');

module.exports = function override(config) {
    const modifiedConfig = aliasWebpack({
        alias: aliasMap,
    })(config);

    if (!modifiedConfig.ignoreWarnings) {
        modifiedConfig.ignoreWarnings = [];
    }

    modifiedConfig.ignoreWarnings.push(/Failed to parse source map/);

    return modifiedConfig;
}