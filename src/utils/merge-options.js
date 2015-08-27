'use strict';

/**
 * merges options and default options together
 *
 * @param  {object} opts            user options object
 * @param  {object} defaultOptions  default options object
 * @return {object} options         merged options object
 */
var mergeOptions = function (opts, defaultOptions) {
    var options = {};

    Object.keys(defaultOptions)
        .map(function (key) {
            if (opts && opts.hasOwnProperty(key)) {
                options[key] = opts[key];
            } else {
                options[key] = defaultOptions[key];
            }
        });

    return options;
};

module.exports = mergeOptions;
