'use strict';

module.exports = function (config) {
    config.set({
        frameworks: [
            'mocha',
            'chai'
        ],

        reporters: [
            'mocha'
        ],

        files: [
          'test/*.js'
        ]
    });
};
