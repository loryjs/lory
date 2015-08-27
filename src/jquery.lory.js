/* globals $, jQuery */

'use strict';

var clamp                = require('./utils/clamp.js');
var mergeOptions         = require('./utils/merge-options.js');
var polyfillCustomEvents = require('./utils/polyfill-custom-events.js');
var detectPrefixes       = require('./utils/detect-prefixes.js');
var dispatchEvent        = require('./utils/dispatch-event.js');

var slice = [].slice;

var lory = function (slider, opts) {
    var position;
    var slidesWidth;
    var frameWidth;
    var slides;

    var index   = 0;
    var options = {};

    var transitionEndCallback;

    /**
     * if object is jQuery convert to native DOM element
     */
    if (typeof jQuery !== 'undefined' && slider instanceof jQuery) {
        slider = slider[0];
    }

    /**
     * slider DOM elements
     */
    var frame;
    var slideContainer;
    var prevCtrl;
    var nextCtrl;
    var prefixes;

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
        slideSpeed: 300,

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
        ease: 'ease',

        /**
         * if slider reached the last slide, with next click the slider goes back to the startindex.
         * use infinite or rewind, not both
         * @rewind {Boolean}
         */
        rewind: false,

        /**
         * number of visible slides or false
         * use infinite or rewind, not both
         * @infinite {number}
         */
        infinite: false,

        /**
         * class name for slider frame
         * @classNameFrame {string}
         */
        classNameFrame: 'js_frame',

        /**
         * class name for slides container
         * @classNameSlideContainer {string}
         */
        classNameSlideContainer: 'js_slides',

        /**
        * class name for slider prev control
         * @classNamePrevCtrl {string}
         */
        classNamePrevCtrl: 'js_prev',

        /**
        * class name for slider next control
         * @classNameNextCtrl {string}
         */
        classNameNextCtrl: 'js_next'
    };

    /**
     * setupInfinite: function to setup if infinite is set
     *
     * @param  {array} slideArray
     * @return {array} array of updated slideContainer elements
     */
    var setupInfinite = function (slideArray) {
        var front = slideArray.slice(0, options.infinite);
        var back  = slideArray.slice(slideArray.length - options.infinite, slideArray.length);

        front.forEach(function (element) {
            var cloned = element.cloneNode(true);

            slideContainer.appendChild(cloned);
        });

        back.reverse()
            .forEach(function (element) {
                var cloned = element.cloneNode(true);

                slideContainer.insertBefore(cloned, slideContainer.firstChild);
            });

        slideContainer.addEventListener(prefixes.transitionEnd, onTransitionEnd);

        return slice.call(slideContainer.children);
    };

    /**
     * public
     * setup function
     */
    var setup = function () {
        dispatchEvent(
            slider,
            'before.lory.init'
        );

        polyfillCustomEvents();

        prefixes = detectPrefixes();

        options = mergeOptions(opts, defaults);

        frame          = slider.getElementsByClassName(options.classNameFrame)[0];
        slideContainer = frame.getElementsByClassName(options.classNameSlideContainer)[0];
        prevCtrl       = slider.getElementsByClassName(options.classNamePrevCtrl)[0];
        nextCtrl       = slider.getElementsByClassName(options.classNameNextCtrl)[0];

        position = {
            x: slideContainer.offsetLeft,
            y: slideContainer.offsetTop
        };

        if (options.infinite) {
            slides = setupInfinite(slice.call(slideContainer.children));
        } else {
            slides = slice.call(slideContainer.children);
        }

        reset();

        if (prevCtrl && nextCtrl) {
            prevCtrl.addEventListener('click', prev);
            nextCtrl.addEventListener('click', next);
        }

        slideContainer.addEventListener('touchstart', onTouchstart);

        window.addEventListener('resize', onResize);

        dispatchEvent(
            slider,
            'after.lory.init'
        );
    };

    /**
     * public
     * reset function: called on resize
     */
    var reset = function () {
        slidesWidth = slideContainer.getBoundingClientRect()
            .width || slideContainer.offsetWidth;
        frameWidth = frame.getBoundingClientRect()
            .width || frame.offsetWidth;

        if (frameWidth === slidesWidth) {
            slidesWidth = slides.reduce(function (previousValue, slide) {
                return previousValue + slide.getBoundingClientRect().width || slide.offsetWidth;
            }, 0);
        }

        index = 0;

        if (options.infinite) {
            translate(slides[index + options.infinite].offsetLeft * -1, 0, null);

            index      = index + options.infinite;
            position.x = slides[index].offsetLeft * -1;
        } else {
            translate(0, options.rewindSpeed, options.ease);
        }
    };

    /**
     * public
     * prev function: called on clickhandler
     */
    var prev = function () {
        slide(false, false);
    };

    /**
     * public
     * next function: called on clickhandler
     */
    var next = function () {
        slide(false, true);
    };

    /**
     * translates to a given position in a given time in milliseconds
     *
     * @to        {number} number in pixels where to translate to
     * @duration  {number} time in milliseconds for the transistion
     * @ease      {string} easing css property
     */
    var translate = function (to, duration, ease) {
        var style = slideContainer && slideContainer.style;

        if (style) {
            style[prefixes.transition + 'TimingFunction'] = ease;
            style[prefixes.transition + 'Duration'] = duration + 'ms';
            style[prefixes.transform] = 'translate3d(' + to + 'px, 0, 0)';
        }
    };

    /**
     * public
     * slidefunction called by prev, next & touchend
     *
     * determine nextIndex and slide to next postion
     * under restrictions of the defined options
     *
     * @direction  {boolean}
     */
    var slide = function (nextIndex, direction) {
        dispatchEvent(
            slider,
            'before.lory.slide', {
                currentSlide: index,
                nextSlide: (direction ? index + 1 : index - 1)
            }
        );

        var maxOffset   = Math.round(slidesWidth - frameWidth);
        var limitIndex  = clamp(0, slides.length - 1);
        var duration    = options.slideSpeed;
        var limitOffset = clamp(maxOffset * -1, 0);

        if (typeof nextIndex !== 'number') {
            if (direction) {
                nextIndex = index + options.slidesToScroll;
            } else {
                nextIndex = index - options.slidesToScroll;
            }
        }

        nextIndex = limitIndex(nextIndex);

        if (options.infinite && direction === undefined) {
            nextIndex += options.infinite;
        }

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

        if (options.infinite && Math.abs(nextOffset) === maxOffset && direction) {
            index      = options.infinite;
            position.x = slides[index].offsetLeft * -1;

            transitionEndCallback = function () {
                translate(slides[index].offsetLeft * -1, 0, null);
            };
        }

        if (options.infinite && Math.abs(nextOffset) === 0 && !direction) {
            index      = slides.length - (options.infinite * 2);
            position.x = slides[index].offsetLeft * -1;

            transitionEndCallback = function () {
                translate(slides[index].offsetLeft * -1, 0, null);
            };
        }

        dispatchEvent(
            slider,
            'after.lory.slide', {
                currentSlide: index
            }
        );
    };

    var touchOffset;
    var delta;
    var isScrolling;

    var onTransitionEnd = function () {
        if (transitionEndCallback) {
            transitionEndCallback();

            transitionEndCallback = undefined;
        }
    };

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

        dispatchEvent(
            slider,
            'on.lory.touchstart'
        );
    };

    var onTouchmove = function (event) {
        var touches = event.touches[0];

        delta = {
            x: touches.pageX - touchOffset.x,
            y: touches.pageY - touchOffset.y
        };

        if (typeof isScrolling === 'undefined') {
            isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
        }

        if (!isScrolling) {
            dispatchEvent(slider, 'before.lory.slide');
            translate(position.x + delta.x, 0, null);
        }
    };

    var onTouchend = function () {
        /**
         * time between touchstart and touchend in milliseconds
         * @duration {number}
         */
        var duration = Date.now() - touchOffset.time;

        /**
         * is valid if:
         *
         * -> swipe attempt time is over 300 ms
         * and
         * -> swipe distance is greater than 25 px
         * or
         * -> swipe distance is more then a third of the swipe area
         *
         * @isValidSlide {Boolean}
         */
        var isValid = Number(duration) < 300 &&
            Math.abs(delta.x) > 25 ||
            Math.abs(delta.x) > frameWidth / 3;

        /**
         * is out of bounds if:
         *
         * -> index is 0 and delta x is greater then 0
         * or
         * -> index is the last slide and delta is smaller than 0
         *
         * @isOutOfBounds {Boolean}
         */
        var isOutOfBounds = !index && delta.x > 0 ||
            index === slides.length - 1 && delta.x < 0;

        var direction = delta.x < 0;

        if (!isScrolling) {
            if (isValid && !isOutOfBounds) {
                slide(false, direction);
            } else {
                translate(position.x, options.snapBackSpeed);
            }
        }

        /**
         * remove eventlisteners after swipe attempt
         */
        frame.removeEventListener('touchmove');
        frame.removeEventListener('touchend');

        dispatchEvent(
            slider,
            'on.lory.touchend'
        );
    };

    var onResize = function () {
        dispatchEvent(
            slider,
            'on.lory.resize'
        );
        reset();
    };

    /**
     * public
     * destroy function: called to gracefully destroy the lory instance
     */
    var destroy = function () {
        dispatchEvent(
            slider,
            'on.lory.destroy'
        );

        // remove event listeners
        slideContainer.removeEventListener(prefixes.transitionEnd, onTransitionEnd);
        slideContainer.removeEventListener('touchstart', onTouchstart);
        window.removeEventListener('resize', onResize);

        if (prevCtrl) {
            prevCtrl.removeEventListener('click', prev);
        }

        if (nextCtrl) {
            nextCtrl.removeEventListener('click', next);
        }

        // release pointers
        position              = undefined;
        slidesWidth           = undefined;
        frameWidth            = undefined;
        index                 = undefined;
        options               = undefined;
        slides                = undefined;
        transitionEndCallback = undefined;
        slider                = undefined;
        frame                 = undefined;
        slideContainer        = undefined;
        prevCtrl              = undefined;
        nextCtrl              = undefined;

        return null;
    };

    // trigger initial setup
    setup();

    return {
        slideTo: function (index) {
            slide(index);
        },

        returnIndex: function () {
            return index;
        },

        setup: setup,

        reset: reset,

        prev: prev,

        next: next,

        destroy: destroy
    };
};

$.fn.lory = function (options) {
    return this.each(function () {
        var instanceOptions;

        if (!$.data(this, 'lory')) {
            instanceOptions = $.extend({}, options, $(this).data());
            $.data(this, 'lory', lory(this, instanceOptions));
        }
    });
};
