'use strict';

module.exports = function(config) {
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
        console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
        process.exit(1);
    }

    var customLaunchers = {
        sauceLabsInternetExplorer9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '9.0'
        },
        sauceLabsInternetExplorer10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '10.0'
        },
        sauceLabsInternetExplorer11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '11.0'
        },
        sauceLabsChrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '39.0'
        },
        sauceLabsFirefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Linux',
            version: '34.0'
        },
        sauceLabsSafari7: {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'Mac 10.9',
            version: '7.0'
        },
        sauceLabsSafari8: {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'Mac 10.10',
            version: '8.0'
        }
    };

    config.set({
        sauceLabs: {
            testName: 'lory Browser Tests',
            connectOptions: {
                port: 5757
            }
        },

        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        reporters: ['dots', 'saucelabs'],

        frameworks: [
            'mocha',
            'chai',
            'fixture'
        ],

       files: [
            'dist/lory.js',
            'test/lory.test.js',
            'demo/app.css',

            {
                pattern: 'test/*.html'
            }
        ],

        plugins: [
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-chai',
            'karma-fixture',
            'karma-sauce-launcher',
            'karma-html2js-preprocessor'
        ],

        preprocessors: {
            'test/*.html': ['html2js']
        },

        singleRun: true
    });
};
