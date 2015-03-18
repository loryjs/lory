/* exported lory */

'use strict';

/**
 * Returns a function that limits input values to range [min <= x <= max].
 * Useful for carousels etc without wrapping around (compare `wrap`).
 * Swapping min and max is allowed and will be corrected.
 * @param  {int} min    The range minimum (optional).
 * @param  {int} max    The range maximum, inclusive.
 * @return {function}   The function that limits its input to the specified range.
 */
var clamp = function (min, max) {
    // Set min to 0 if only one value specified
    if (typeof max === 'undefined') {
        max = min;
        min = 0;
    }

    // Swap min and max if required
    if (min > max) {
        var tmp = min;
        min = max;
        max = tmp;
    }

    return function (value) {
        return Math.min(Math.max(value, min), max);
    };
};

/**
 * merges options and default options together
 * @param  {object} opts           [description]
 * @param  {object} defaultoptions [description]
 * @return {object}                [description]
 */
var mergeOptions = function (opts, defaultOptions) {
    var options = {};

    Object.keys(defaultOptions).map(function (key) {
        if (opts && opts.hasOwnProperty(key)) {
            options[key] = opts[key];
        } else {
            options[key] = defaultOptions[key];
        }
    });

    return options;
};

var lory = function (slider, opts) {
    var position;
    var slidesWidth;
    var frameWidth;
    var slides;

    var index   = 0;
    var options = {};

    /**
     * slider DOM elements
     */
    var frame          = slider.querySelector('.js_frame');
    var slideContainer = frame.querySelector('.js_slides');
    var prevCtrl       = slider.querySelector('.js_prev');
    var nextCtrl       = slider.querySelector('.js_next');

    var defaults = {
        /**
         * slides scrolled at once
         * @slidesToScroll {Number}
         */
        slidesToScroll: 1,

        /**
         * time in milliseconds for the animation of a valid slide attempt
         * @slideSpeed {Number}
         */
        slideSpeed: 400,

        /**
         * time in milliseconds for the animation of the rewind after the last slide
         * @rewindSpeed {Number}
         */
        rewindSpeed: 600,

        /**
         * time for the snapBack of the slider if the slide attempt was not valid
         * @snapBackSpeed {Number}
         */
        snapBackSpeed: 200,

        /**
         * Basic easing functions: https://developer.mozilla.org/de/docs/Web/CSS/transition-timing-function
         * cubic bezier easing functions: http://easings.net/de
         * @ease {String}
         */
        ease: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',

        /**
         * if slider reached the last slide, with next click the slider goes back to the startindex.
         * does not work for touchevents
         * @rewind {Boolean}
         */
        rewind: false,

        // available callbacks

        onInit: function () {
            return true;
        },

        onPrev: function () {
            return true;
        },

        onNext: function () {
            return true;
        },

        onMove: function () {
            return true;
        },

        onResize: function () {
            return true;
        }
    };

    var setup = function () {
        options = mergeOptions(opts, defaults);
        slides  = Array.prototype.slice.call(slideContainer.children);

        options.onInit();

        resetSlider();

        if (prevCtrl && nextCtrl) {
            prevCtrl.addEventListener('click', prev);
            nextCtrl.addEventListener('click', next);
        }

        slideContainer.addEventListener('touchstart', onTouchstart);

        window.addEventListener('resize', onResize);
    };

    var resetSlider = function () {
        slidesWidth = slideContainer.getBoundingClientRect().width || slideContainer.offsetWidth;
        frameWidth  = frame.getBoundingClientRect().width || frame.offsetWidth;

        translate(0, options.rewindSpeed, options.ease);

        index = 0;

        position = {
            x: slideContainer.offsetLeft,
            y: slideContainer.offsetTop
        };
    };

    var prev = function () {
        options.onPrev();
        slide(false);
    };

    var next = function () {
        options.onNext();
        slide(true);
    };

    /**
     * translates to a given position in a in a given time in milliseconds
     * @to  {number} number in pixels where to translate to
     * @duration  {number} time in milliseconds for the transistion
     */
    var translate = function (to, duration, ease) {
        var style = slideContainer && slideContainer.style;

        if (!style) {
            return;
        }

        style.webkitTransitionTimingFunction =
        style.MozTransitionTimingFunction    =
        style.msTransitionTimingFunction     =
        style.OTransitionTimingFunction      =
        style.transitionTimingFunction       = ease;

        style.webkitTransitionDuration =
        style.MozTransitionDuration    =
        style.msTransitionDuration     =
        style.OTransitionDuration      =
        style.transitionDuration       = duration + 'ms';

        style.webkitTransform = 'translate3d(' + to + 'px, 0, 0)';

        style.msTransform  =
        style.MozTransform =
        style.OTransform   = 'translateX(' + to + 'px)';
    };

    /**
     * calculates the distance to slide to the next index
     * and calls then with the values the translate function
     * @nextIndex  {number}
     */
    var slide = function (direction) {
        var nextIndex;

        var maxOffset   = (slidesWidth - frameWidth);
        var limitIndex  = clamp(0, slides.length - 1);
        var limitOffset = clamp(maxOffset * -1, 0);
        var duration    = options.slideSpeed;

        if (direction) {
            nextIndex = index + options.slidesToScroll;
        } else {
            nextIndex = index - options.slidesToScroll;
        }

        nextIndex  = limitIndex(nextIndex);

        var nextOffset = limitOffset(slides[nextIndex].offsetLeft * -1);

        if (options.rewind && Math.abs(position.x) === maxOffset && direction) {
            nextOffset = 0;
            nextIndex  = 0;
            duration   = options.rewindSpeed;
        }

        /**
         * translate to the nextOffset by a defined duration and ease function
         */
        translate(nextOffset, duration, options.ease);

        /**
         * update the position with the next position
         */
        position.x = nextOffset;

        /**
         * update the index with the nextIndex only if
         * the offset of the nextIndex is in the range of the maxOffset
         */
        if (slides[nextIndex].offsetLeft <= maxOffset) {
            index = nextIndex;
        }
    };

    var touchOffset;
    var delta;
    var isScrolling;

    var onTouchstart = function (event) {
        var touches = event.touches[0];

        touchOffset = {
            x: touches.pageX,
            y: touches.pageY,

            time: Date.now()
        };

        isScrolling = undefined;

        delta = {};

        slideContainer.addEventListener('touchmove', onTouchmove);
        slideContainer.addEventListener('touchend', onTouchend);
    };

    var onTouchmove = function (event) {
        options.onMove()
        var touches = event.touches[0];

        delta = {
            x: touches.pageX - touchOffset.x,
            y: touches.pageY - touchOffset.y
        };

        if (typeof isScrolling === 'undefined') {
            isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
        }

        if (!isScrolling) {
            translate(position.x + delta.x, 0, options.ease);
        }
    };

    var onTouchend = function () {
        var duration     = Date.now() - touchOffset.time;
        var isValidSlide = Number(duration) < 250 && Math.abs(delta.x) > 15 || Math.abs(delta.x) > frameWidth / 3;
        var isPastBounds = !index && delta.x > 0 || index === slides.length - 1 && delta.x < 0;
        var direction    = delta.x < 0;

        if (!isScrolling) {
            if (isValidSlide && !isPastBounds) {
                if (direction) {
                    slide(true);
                } else {
                    slide(false);
                }
            } else {
                translate(position.x, options.snapBackSpeed);
            }
        }

        frame.removeEventListener('touchmove');
        frame.removeEventListener('touchend');
    };

    var onResize = function () {
        options.onResize();
        resetSlider();
    };

    // trigger initial setup
    setup();

    return {
        setup: function () {
            setup();
        },

        reset: function () {
            resetSlider();
        },

        slide: function (index) {
            slide(index);
        },

        prev: prev,
        next: next
    };
};
