'use strict';

/**
* Polyfill for creating CustomEvents on IE9/10/11
*
* code pulled from:
* https://github.com/d4tocchini/customevent-polyfill
*/
var customEventPolyfill = function () {
    try {
        new CustomEvent('test'); // jshint ignore:line
    } catch (e) {
        var CustomEvent = function (event, params) {
            var evt;

            params = params || {
                bubbles: false,
                cancelable: false,
                detail: undefined
            };

            evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

            return evt;
        };

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent    = CustomEvent; // expose definition to window
    }
};

module.exports = customEventPolyfill;
