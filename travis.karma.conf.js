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
            'PhantomJS'
        ],

        plugins: [
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-chai',
            'karma-fixture',
            'karma-phantomjs-launcher',
            'karma-html2js-preprocessor'
        ],

        preprocessors: {
            'test/*.html': ['html2js']
        },

        singleRun: true
    });
};
