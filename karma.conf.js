'use strict';

module.exports = function(config) {
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
        console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
        process.exit(1);
    }

    var customLaunchers = {
        sl_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 7',
            version: '35'
        },

        sl_firefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            version: '30'
        },

        sl_ios_safari: {
            base: 'SauceLabs',
            browserName: 'iphone',
            platform: 'OS X 10.9',
            version: '7.1'
        },

        sl_ie_11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11'
        }
    };

    config.set({
        sauceLabs: {
            testName: 'lory Browser Tests'
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
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-ie-launcher',
            'karma-opera-launcher',
            'karma-firefox-launcher',
            'karma-safari-launcher',
            'karma-html2js-preprocessor'
        ],

        preprocessors: {
            'test/*.html': ['html2js']
        },

        singleRun: true
    });
};
