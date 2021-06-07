module.exports = {
    trailingComma: 'es5',
    tabWidth: 4,
    bracketSpacing: false,
    singleQuote: true,
    printWidth: 120,
    endOfLine: 'auto',
    useTabs: false,
    semi: true,
    overrides: [
        {
            files: ['*.json', '.*rc'],
            options: {
                parser: 'json',
                tabWidth: 2,
            },
        },
    ],
};
