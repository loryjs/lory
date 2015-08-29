/* globals jQuery */

import clamp from './utils/clamp.js';
import polyfillCustomEvents from './utils/polyfill-custom-events.js';
import detectPrefixes from './utils/detect-prefixes.js';
import dispatchEvent from './utils/dispatch-event.js';
import defaults from './defaults.js';

const slice = Array.prototype.slice;

export default function lory(slider, opts) {
    let position;
    let slidesWidth;
    let frameWidth;
    let slides;

    /**
     * slider DOM elements
     */
    let frame;
    let slideContainer;
    let prevCtrl;
    let nextCtrl;
    let prefixes;
    let transitionEndCallback;

    let index   = 0;
    let options = {};

    /**
     * if object is jQuery convert to native DOM element
     */
    if (typeof jQuery !== 'undefined' && slider instanceof jQuery) {
        slider = slider[0];
    }

    /**
     * private
     * setupInfinite: function to setup if infinite is set
     *
     * @param  {array} slideArray
     * @return {array} array of updated slideContainer elements
     */
    function setupInfinite(slideArray) {
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
    }

    /**
     * [dispatchSliderEvent description]
     * @return {[type]} [description]
     */
    function dispatchSliderEvent(phase, type, detail) {
        dispatchEvent(slider, `${phase}.lory.${type}`, detail);
    }

    /**
     * public
     * setup function
     */
    function setup() {
        dispatchSliderEvent('before', 'init');

        polyfillCustomEvents();

        prefixes = detectPrefixes();

        options = {...defaults, ...opts};

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

        dispatchSliderEvent('after', 'init');
    }

    /**
     * public
     * reset function: called on resize
     */
    function reset() {
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
    }

    function slideTo(index) {
        slide(index);
    }

    function returnIndex() {
        return index;
    }

    /**
     * public
     * prev function: called on clickhandler
     */
    function prev() {
        slide(false, false);
    }

    /**
     * public
     * next function: called on clickhandler
     */
    function next() {
        slide(false, true);
    }

    /**
     * translates to a given position in a given time in milliseconds
     *
     * @to        {number} number in pixels where to translate to
     * @duration  {number} time in milliseconds for the transistion
     * @ease      {string} easing css property
     */
    function translate(to, duration, ease) {
        var style = slideContainer && slideContainer.style;

        if (style) {
            style[prefixes.transition + 'TimingFunction'] = ease;
            style[prefixes.transition + 'Duration'] = duration + 'ms';
            style[prefixes.transform] = 'translate3d(' + to + 'px, 0, 0)';
        }
    }

    /**
     * public
     * slidefunction called by prev, next & touchend
     *
     * determine nextIndex and slide to next postion
     * under restrictions of the defined options
     *
     * @direction  {boolean}
     */
    function slide(nextIndex, direction) {
        let currentSlide = index;
        let nextSlide    = direction ? index + 1 : index - 1;

        dispatchSliderEvent('before', 'slide', {
            currentSlide,
            nextSlide
        });

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

        if (options.infinite) {
            if (Math.abs(nextOffset) === maxOffset && direction) {
                index = options.infinite;
            }

            if (Math.abs(nextOffset) === 0 && !direction) {
                index = slides.length - (options.infinite * 2);
            }

            position.x = slides[index].offsetLeft * -1;

            transitionEndCallback = function () {
                translate(slides[index].offsetLeft * -1, 0, null);
            };
        }

        dispatchSliderEvent('after', 'slide', {
            currentSlide: index
        });
    }

    // event handling

    let touchOffset;
    let delta;
    let isScrolling;

    function onTransitionEnd() {
        if (transitionEndCallback) {
            transitionEndCallback();

            transitionEndCallback = undefined;
        }
    }

    function onTouchstart(event) {
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

        // may be
        dispatchSliderEvent('on', 'touchstart', {
            event
        });
    }

    function onTouchmove(event) {
        var touches = event.touches[0];

        delta = {
            x: touches.pageX - touchOffset.x,
            y: touches.pageY - touchOffset.y
        };

        if (typeof isScrolling === 'undefined') {
            isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
        }

        if (!isScrolling) {
            translate(position.x + delta.x, 0, null);
        }

        // may be
        dispatchSliderEvent('on', 'touchmove', {
            event
        });
    }

    function onTouchend() {
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
         * -> swipe distance is greater than 25px
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
         * -> index is 0 and delta x is greater than 0
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

        // may be
        dispatchSliderEvent('on', 'touchend', {
            event
        });
    }

    function onResize() {
        // may be
        dispatchSliderEvent('on', 'resize', {
            event
        });

        reset();
    }

    /**
     * public
     * destroy function: called to gracefully destroy the lory instance
     */
    function destroy() {
        dispatchSliderEvent('before', 'destroy');

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

        dispatchSliderEvent('after', 'destroy');
    }

    // trigger initial setup
    setup();

    // expose public api
    return {
        slideTo,
        returnIndex,
        setup,
        reset,
        prev,
        next,
        destroy
    };
}
