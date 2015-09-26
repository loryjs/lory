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
            'karma-html2js-preprocessor'
        ],

        preprocessors: {
            'test/*.html': ['html2js']
        }
    });
};
