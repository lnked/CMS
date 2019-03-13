// Jest configuration
// https://facebook.github.io/jest/docs/en/configuration.html
module.exports = {
    setupFiles: ['<rootDir>/webpack/jest/shim.js', '<rootDir>/webpack/jest/setup.js'],

    // Modules can be explicitly auto-mocked using jest.mock(moduleName).
    // https://facebook.github.io/jest/docs/en/configuration.html#automock-boolean
    automock: false, // [boolean]

    // Respect Browserify's 'browser' field in package.json when resolving modules.
    // https://facebook.github.io/jest/docs/en/configuration.html#browser-boolean
    browser: false, // [boolean]

    // This config option can be used here to have Jest stop running tests after the first failure.
    // https://facebook.github.io/jest/docs/en/configuration.html#bail-boolean
    bail: false, // [boolean]

    clearMocks: false,

    // The directory where Jest should store its cached dependency information.
    // https://facebook.github.io/jest/docs/en/configuration.html#cachedirectory-string
    // cacheDirectory: '/tmp/<path>', // [string]

    // Indicates whether the coverage information should be collected while executing the test.
    // Because this retrofits all executed files with coverage collection statements,
    // it may significantly slow down your tests.
    // https://facebook.github.io/jest/docs/en/configuration.html#collectcoverage-boolean
    // collectCoverage: false, // [boolean]

    // https://facebook.github.io/jest/docs/en/configuration.html#collectcoveragefrom-array
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],

    testURL: 'http://localhost',

    modulePaths: ['<rootDir>/src', '<rootDir>/node_modules'],

    testMatch: ['<rootDir>/src/**/__tests__/**/*.(ts|tsx|js|jsx)', '<rootDir>/src/**/?(*.)(spec|test).(ts|tsx|js|jsx)'],

    testEnvironment: 'jest-environment-jsdom',

    transform: {
        '^(?!.*\\.(jsx?|tsx?|json|css|less|styl|s(a|c)?ss)$)': '<rootDir>/webpack/jest/fileTransformer.js',
        '\\.(jsx?)$': '<rootDir>/node_modules/babel-jest',
        '\\.(tsx?)$': '<rootDir>/node_modules/ts-jest',
        // '\\.(tsx?)$': 'ts-jest'
        // '\\.(tsx?)$': '<rootDir>/webpack/jest/tsPreprocessor.js'
        // '\\.(tsx?)$': '<rootDir>/node_modules/ts-jest/preprocessor.js'
    },

    testPathIgnorePatterns: ['/node_modules/', '__snapshots__'],

    transformIgnorePatterns: [ '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx|)$' ],

    coveragePathIgnorePatterns: [ '/node_modules/' ],

    // https://facebook.github.io/jest/docs/en/configuration.html#coveragedirectory-string
    coverageDirectory: '<rootDir>/coverage', // [string]

    globals: {
        __DEV__: false,
        NODE_ENV: 'test',
        'ts-jest': {
            useBabelrc: true,
            tsConfigFile: './tsconfig.jest.json',
        },
    },

    // https://facebook.github.io/jest/docs/en/configuration.html#mapcoverage-boolean
    // mapCoverage: false, // [boolean]

    // The default extensions Jest will look for.
    // https://facebook.github.io/jest/docs/en/configuration.html#modulefileextensions-array-string
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

    moduleDirectories: ['node_modules', 'src'],

    // A map from regular expressions to module names that allow to stub out resources,
    // like images or styles with a single module.
    moduleNameMapper: {
        // '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/internals/mocks/fileMock.js',
        '^pages/(.*)': '<rootDir>/src/pages/$1',
        '^layouts/(.*)': '<rootDir>/src/layouts/$1',
        '^segments/(.*)': '<rootDir>/src/segments/$1',
        '^components/(.*)': '<rootDir>/src/components/$1',
        '\\.(css|less|styl|scss|sass|sss)$': 'identity-obj-proxy',
    },

    verbose: true,
}
