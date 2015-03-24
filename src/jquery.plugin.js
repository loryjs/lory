/* globals $, lory */

$.fn.lory = function (options) {
    'use strict';

    return this.each(function () {
        var instanceOptions;

        if (!$.data(this, 'lory')) {
            instanceOptions = $.extend({}, options, $(this).data());
            $.data(this, 'lory', lory(this, instanceOptions));
        }
    });
};
