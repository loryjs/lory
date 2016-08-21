'use strict';

module.exports = function (config) {
    config.set({
        frameworks: [
            'mocha',
            'chai',
            'fixture'
        ],

        reporters: [
            'mocha'
        ],

        files: [
            'dist/lory.js',
            'test/lory.test.js',
            'static/app.css',
            'http://cdnjs.cloudflare.com/ajax/libs/classlist/2014.01.31/classList.min.js',

            {
                pattern: 'test/*.html'
            }
        ],

        browsers: [
            'Chrome',
            'ChromeCanary',
            'PhantomJS',
            'Firefox',
            'Safari'
        ],

        plugins: [
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-chai',
            'karma-fixture',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-ie-launcher',
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
