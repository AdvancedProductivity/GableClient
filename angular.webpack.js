/**
 * Custom angular webpack configuration
 */
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = (config, options) => {
    config.target = 'electron-renderer';


    if (options.fileReplacements) {
        for(let fileReplacement of options.fileReplacements) {
            if (fileReplacement.replace !== 'src/environments/environment.ts') {
                continue;
            }

            let fileReplacementParts = fileReplacement['with'].split('.');
            if (fileReplacementParts.length > 1 && ['web'].indexOf(fileReplacementParts[1]) >= 0) {
                config.target = 'web';
            }
            break;
        }
    }

    config.plugins.push(new MonacoWebpackPlugin({
      languages: ['css', 'html', 'javascript', 'sql', 'typescript', 'groovy'],
      features: ['contextmenu', 'clipboard', 'find'],
    }));
    return config;
}
