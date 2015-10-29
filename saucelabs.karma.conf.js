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
        edge: {
            base: 'SauceLabs',
            browserName: 'microsoftedge'
        },
        sauceLabsChrome46: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '46.0'
        },
        sauceLabsChrome45: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '45.0'
        },
        sauceLabsFirefox41: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Linux',
            version: '41.0'
        },
        sauceLabsFirefox40: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Linux',
            version: '40.0'
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
        // sauceLabsIPhone9: {
        //     base: 'SauceLabs',
        //     browserName: 'iPhone',
        //     version: '9.0'
        // },
        // sauceLabsIPhone8: {
        //     base: 'SauceLabs',
        //     browserName: 'iPhone',
        //     version: '8.0'
        // },
        // sauceLabsIPhone7: {
        //     base: 'SauceLabs',
        //     browserName: 'iPhone',
        //     version: '7.0'
        // },
        // sauceLabsIPad9: {
        //     base: 'SauceLabs',
        //     browserName: 'iPad',
        //     version: '9.0'
        // },
        // sauceLabsIPad8: {
        //     base: 'SauceLabs',
        //     browserName: 'iPad',
        //     version: '8.0'
        // },
        // sauceLabsIPad7: {
        //     base: 'SauceLabs',
        //     browserName: 'iPad',
        //     version: '7.0'
        // }
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
            'http://cdnjs.cloudflare.com/ajax/libs/classlist/2014.01.31/classList.min.js',

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

        browserDisconnectTimeout : 10000, // default 2000
        browserDisconnectTolerance : 1, // default 0
        browserNoActivityTimeout : 4*60*1000, //default 10000
        captureTimeout : 4*60*1000, //default 60000

        singleRun: true
    });
};
