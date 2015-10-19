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
        sauceLabsChrome_46: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '46.0'
        },
        sauceLabsChrome_45: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '45.0'
        },
        sauceLabsChrome_44: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '44.0'
        },
        sauceLabsChrome_43: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '43.0'
        },
        sauceLabsChrome_42: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '42.0'
        },
        sauceLabsChrome_41: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '41.0'
        },
        sauceLabsChrome_40: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '40.0'
        },
        sauceLabsChrome_39: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '39.0'
        },
        sauceLabsChrome_38: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '38.0'
        },
        sauceLabsChrome_37: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '37.0'
        },
        sauceLabsFirefoxLatest: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Linux'
        },
        sauceLabsFirefox_39: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Linux',
            version: '39.0'
        },
        sauceLabsFirefox_38: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Linux',
            version: '38.0'
        },
        sauceLabsFirefox_37: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Linux',
            version: '37.0'
        },
        sauceLabsFirefox_36: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Linux',
            version: '36.0'
        },
        sauceLabsFirefox_35: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Linux',
            version: '35.0'
        },
        sauceLabsFirefox_34: {
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
        },
        sauceLabsIPhone_latest: {
            base: 'SauceLabs',
            browserName: 'iPhone'
        },
        sauceLabsIPhone_7: {
            base: 'SauceLabs',
            browserName: 'iPhone',
            version: '7.1'
        },
        sauceLabsAndroid_tablet_4: {
            base: 'SauceLabs',
            browserName: 'android',
            version: '4.4'
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
