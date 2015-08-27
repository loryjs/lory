'use strict';

/**
 * Detecting prefixes for saving time and bytes
 */
var detectPrefixes = function () {
    var transform;
    var transition;
    var transitionEnd;

    (function () {
        var style = document.createElement('_')
            .style;

        var prop;

        if (style[prop = 'webkitTransition'] === '') {
            transitionEnd = 'webkitTransitionEnd';
            transition = prop;
        }

        if (style[prop = 'transition'] === '') {
            transitionEnd = 'transitionend';
            transition = prop;
        }

        if (style[prop = 'webkitTransform'] === '') {
            transform = prop;
        }

        if (style[prop = 'msTransform'] === '') {
            transform = prop;
        }

        if (style[prop = 'transform'] === '') {
            transform = prop;
        }
    }());

    return {
        transform: transform,
        transition: transition,
        transitionEnd: transitionEnd
    };
};

module.exports = detectPrefixes;
