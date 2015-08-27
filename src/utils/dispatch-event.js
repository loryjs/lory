'use strict';

/**
 * dispatch custom events
 *
 * @param  {element} el         slideshow element
 * @param  {string}  type       custom event name
 * @param  {object}  detail     custom detail information
 */
var dispatchEvent = function (el, type, detail) {
    var e = new CustomEvent(type, {
        detail: detail,
        bubbles: true,
        cancelable: true
    });

    el.dispatchEvent(e);
};

module.exports = dispatchEvent;
