module.exports = {
    rootTranslationsPath: 'src/assets/i18n/',
    langs: ['en_US', 'de_DE'],
    keysManager: {
        fileFormat: 'json', // or 'pot'
        addMissingKeys: true,
        defaultValue: '',
        interpolation: ['{{', '}}']
    }
};
