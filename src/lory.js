/* globals jQuery */

import detectPrefixes from './utils/detect-prefixes.js';
import dispatchEvent from './utils/dispatch-event.js';
import defaults from './defaults.js';

const slice = Array.prototype.slice;

export function lory (slider, opts) {
    let position;
    let slidesSize;
    let frameSize;
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

    const axisY = 'y';
    const axisX = 'x';
    let axis;

    /**
     * if object is jQuery convert to native DOM element
     */
    if (typeof jQuery !== 'undefined' && slider instanceof jQuery) {
        slider = slider[0];
    }

    /**
     * private
     * return width or height of element by axis
     */
    function getElementSize (element, currentAxis = axis) {
        switch (currentAxis) {
            case axisY:
                return element.getBoundingClientRect().height || element.offsetHeight;
            default:
                return element.getBoundingClientRect().width || element.offsetWidth;
        }
    }

    /**
     * private
     * return offset of element by axis
     */
    function getElementOffset (element, currentAxis = axis) {
        switch (currentAxis) {
            case axisY:
                return element.offsetTop;
            default:
                return element.offsetLeft;
        }
    }

    /**
     * private
     * set active class to element which is the current slide
     */
    function setActiveElement (slides, currentIndex) {
        const {classNameActiveSlide} = options;

        slides.forEach((element, index) => {
            if (element.classList.contains(classNameActiveSlide)) {
                element.classList.remove(classNameActiveSlide);
            }
        });

        slides[currentIndex].classList.add(classNameActiveSlide);
    }

    /**
     * private
     * setupInfinite: function to setup if infinite is set
     *
     * @param  {array} slideArray
     * @return {array} array of updated slideContainer elements
     */
    function setupInfinite (slideArray) {
        const {infinite} = options;

        const front = slideArray.slice(0, infinite);
        const back  = slideArray.slice(slideArray.length - infinite, slideArray.length);

        front.forEach(function (element) {
            const cloned = element.cloneNode(true);

            slideContainer.appendChild(cloned);
        });

        back.reverse()
            .forEach(function (element) {
                const cloned = element.cloneNode(true);

                slideContainer.insertBefore(cloned, slideContainer.firstChild);
            });

        slideContainer.addEventListener(prefixes.transitionEnd, onTransitionEnd);

        return slice.call(slideContainer.children);
    }

    /**
     * [dispatchSliderEvent description]
     * @return {[type]} [description]
     */
    function dispatchSliderEvent (phase, type, detail) {
        dispatchEvent(slider, `${phase}.lory.${type}`, detail);
    }

    /**
     * translates to a given position in a given time in milliseconds
     *
     * @to        {number} number in pixels where to translate to
     * @duration  {number} time in milliseconds for the transistion
     * @ease      {string} easing css property
     */
    function translate (to, duration, ease) {
        const style = slideContainer && slideContainer.style;

        if (style) {
            style[prefixes.transition + 'TimingFunction'] = ease;
            style[prefixes.transition + 'Duration'] = duration + 'ms';

            const translate = axis === axisY ? `0, ${to}px` : `${to}px, 0`;
            if (prefixes.hasTranslate3d) {
                style[prefixes.transform] = `translate3d(${translate}, 0)`;
            } else {
                style[prefixes.transform] = `translate(${translate})`;
            }
        }
    }

    /**
     * slidefunction called by prev, next & touchend
     *
     * determine nextIndex and slide to next postion
     * under restrictions of the defined options
     *
     * @direction  {boolean}
     */
    function slide (nextIndex, direction) {
        const {
            slideSpeed,
            slidesToScroll,
            infinite,
            rewind,
            rewindSpeed,
            ease,
            classNameActiveSlide
        } = options;

        let duration = slideSpeed;

        const nextSlide = direction ? index + 1 : index - 1;
        const maxOffset = Math.round(slidesSize - frameSize);

        dispatchSliderEvent('before', 'slide', {
            index,
            nextSlide
        });

        if (typeof nextIndex !== 'number') {
            if (direction) {
                nextIndex = index + slidesToScroll;
            } else {
                nextIndex = index - slidesToScroll;
            }
        }

        nextIndex = Math.min(Math.max(nextIndex, 0), slides.length - 1);

        if (infinite && direction === undefined) {
            nextIndex += infinite;
        }

        let nextOffset = Math.min(Math.max(getElementOffset(slides[nextIndex]) * -1, maxOffset * -1), 0);

        if (rewind && Math.abs(position[axis]) === maxOffset && direction) {
            nextOffset = 0;
            nextIndex = 0;
            duration = rewindSpeed;
        }

        /**
         * translate to the nextOffset by a defined duration and ease function
         */
        translate(nextOffset, duration, ease);

        /**
         * update the position with the next position
         */
        position[axis] = nextOffset;

        /**
         * update the index with the nextIndex only if
         * the offset of the nextIndex is in the range of the maxOffset
         */
        if (getElementOffset(slides[nextIndex]) <= maxOffset) {
            index = nextIndex;
        }

        if (infinite && (nextIndex === slides.length - infinite || nextIndex === 0)) {
            if (direction) {
                index = infinite;
            }

            if (!direction) {
                index = slides.length - (infinite * 2);
            }

            position[axis] = getElementOffset(slides[index]) * -1;

            transitionEndCallback = function () {
                translate(getElementOffset(slides[index]) * -1, 0, undefined);
            };
        }

        if (classNameActiveSlide) {
            setActiveElement(slice.call(slides), index);
        }

        dispatchSliderEvent('after', 'slide', {
            currentSlide: index
        });
    }

    /**
     * public
     * setup function
     */
    function setup () {
        dispatchSliderEvent('before', 'init');

        prefixes = detectPrefixes();
        options = {...defaults, ...opts};

        const {
            classNameFrame,
            classNameSlideContainer,
            classNamePrevCtrl,
            classNameNextCtrl,
            enableMouseEvents,
            classNameActiveSlide,
            vertical
        } = options;

        frame = slider.getElementsByClassName(classNameFrame)[0];
        slideContainer = frame.getElementsByClassName(classNameSlideContainer)[0];
        prevCtrl = slider.getElementsByClassName(classNamePrevCtrl)[0];
        nextCtrl = slider.getElementsByClassName(classNameNextCtrl)[0];

        axis = vertical ? axisY : axisX;

        position = {
            x: getElementOffset(slideContainer, axisX),
            y: getElementOffset(slideContainer, axisY)
        };

        if (options.infinite) {
            slides = setupInfinite(slice.call(slideContainer.children));
        } else {
            slides = slice.call(slideContainer.children);
        }

        reset();

        if (classNameActiveSlide) {
            setActiveElement(slides, index);
        }

        if (prevCtrl && nextCtrl) {
            prevCtrl.addEventListener('click', prev);
            nextCtrl.addEventListener('click', next);
        }

        frame.addEventListener('touchstart', onTouchstart);

        if (enableMouseEvents) {
            frame.addEventListener('mousedown', onTouchstart);
            frame.addEventListener('click', onClick);
        }

        options.window.addEventListener('resize', onResize);

        dispatchSliderEvent('after', 'init');
    }

    /**
     * public
     * reset function: called on resize
     */
    function reset () {
        var {infinite, ease, rewindSpeed, rewindOnResize, classNameActiveSlide} = options;

        slidesSize = getElementSize(slideContainer);
        frameSize = getElementSize(frame);

        if (frameSize === slidesSize) {
            slidesSize = slides.reduce(function (previousValue, slide) {
                return previousValue + getElementSize(slide);
            }, 0);
        }

        if (rewindOnResize) {
            index = 0;
        } else {
            ease = null;
            rewindSpeed = 0;
        }

        if (infinite) {
            translate(getElementOffset(slides[index + infinite]) * -1, 0, null);

            index = index + infinite;
            position[axis] = getElementOffset(slides[index]) * -1;
        } else {
            translate(getElementOffset(slides[index]) * -1, rewindSpeed, ease);
            position[axis] = getElementOffset(slides[index]) * -1;
        }

        if (classNameActiveSlide) {
            setActiveElement(slice.call(slides), index);
        }
    }

    /**
     * public
     * slideTo: called on clickhandler
     */
    function slideTo (index) {
        slide(index);
    }

    /**
     * public
     * returnIndex function: called on clickhandler
     */
    function returnIndex () {
        return index - options.infinite || 0;
    }

    /**
     * public
     * prev function: called on clickhandler
     */
    function prev () {
        slide(false, false);
    }

    /**
     * public
     * next function: called on clickhandler
     */
    function next () {
        slide(false, true);
    }

    /**
     * public
     * destroy function: called to gracefully destroy the lory instance
     */
    function destroy () {
        dispatchSliderEvent('before', 'destroy');

        // remove event listeners
        frame.removeEventListener(prefixes.transitionEnd, onTransitionEnd);
        frame.removeEventListener('touchstart', onTouchstart);
        frame.removeEventListener('touchmove', onTouchmove);
        frame.removeEventListener('touchend', onTouchend);
        frame.removeEventListener('mousemove', onTouchmove);
        frame.removeEventListener('mousedown', onTouchstart);
        frame.removeEventListener('mouseup', onTouchend);
        frame.removeEventListener('mouseleave', onTouchend);
        frame.removeEventListener('click', onClick);

        options.window.removeEventListener('resize', onResize);

        if (prevCtrl) {
            prevCtrl.removeEventListener('click', prev);
        }

        if (nextCtrl) {
            nextCtrl.removeEventListener('click', next);
        }

        // remove cloned slides if infinite is set
        if (options.infinite) {
            Array.apply(null, Array(options.infinite)).forEach(function () {
                slideContainer.removeChild(slideContainer.firstChild);
                slideContainer.removeChild(slideContainer.lastChild);
            });
        }

        dispatchSliderEvent('after', 'destroy');
    }

    // event handling

    let touchOffset;
    let delta;
    let isScrolling;

    function onTransitionEnd () {
        if (transitionEndCallback) {
            transitionEndCallback();

            transitionEndCallback = undefined;
        }
    }

    function onTouchstart (event) {
        const {enableMouseEvents} = options;
        const touches = event.touches ? event.touches[0] : event;

        if (enableMouseEvents) {
            frame.addEventListener('mousemove', onTouchmove);
            frame.addEventListener('mouseup', onTouchend);
            frame.addEventListener('mouseleave', onTouchend);
        }

        frame.addEventListener('touchmove', onTouchmove);
        frame.addEventListener('touchend', onTouchend);

        const {pageX, pageY} = touches;

        touchOffset = {
            x: pageX,
            y: pageY,
            time: Date.now()
        };

        isScrolling = undefined;

        delta = {};

        dispatchSliderEvent('on', 'touchstart', {
            event
        });
    }

    function onTouchmove (event) {
        const touches = event.touches ? event.touches[0] : event;
        const {pageX, pageY} = touches;

        delta = {
            x: pageX - touchOffset.x,
            y: pageY - touchOffset.y
        };

        if (typeof isScrolling === 'undefined') {
            if (axis === axisY) {
                isScrolling = Math.abs(delta.y) < Math.abs(delta.x);
            } else {
                isScrolling = Math.abs(delta.x) < Math.abs(delta.y);
            }
        }

        if (!isScrolling && touchOffset) {
            event.preventDefault();
            translate(position[axis] + delta[axis], 0, null);
        }

        // may be
        dispatchSliderEvent('on', 'touchmove', {
            event
        });
    }

    function onTouchend (event) {
        /**
         * time between touchstart and touchend in milliseconds
         * @duration {number}
         */
        const duration = touchOffset ? Date.now() - touchOffset.time : undefined;

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
        const isValid = Number(duration) < 300 &&
            Math.abs(delta[axis]) > 25 ||
            Math.abs(delta[axis]) > frameSize / 3;

        /**
         * is out of bounds if:
         *
         * -> index is 0 and delta x is greater than 0
         * or
         * -> index is the last slide and delta is smaller than 0
         *
         * @isOutOfBounds {Boolean}
         */
        const isOutOfBounds = !index && delta[axis] > 0 ||
            index === slides.length - 1 && delta[axis] < 0;

        const direction = delta[axis] < 0;

        if (!isScrolling) {
            if (isValid && !isOutOfBounds) {
                slide(false, direction);
            } else {
                translate(position[axis], options.snapBackSpeed);
            }
        }

        touchOffset = undefined;

        /**
         * remove eventlisteners after swipe attempt
         */
        frame.removeEventListener('touchmove', onTouchmove);
        frame.removeEventListener('touchend', onTouchend);
        frame.removeEventListener('mousemove', onTouchmove);
        frame.removeEventListener('mouseup', onTouchend);
        frame.removeEventListener('mouseleave', onTouchend);

        dispatchSliderEvent('on', 'touchend', {
            event
        });
    }

    function onClick (event) {
        if (delta[axis]) {
            event.preventDefault();
        }
    }

    function onResize (event) {
        reset();

        dispatchSliderEvent('on', 'resize', {
            event
        });
    }

    // trigger initial setup
    setup();

    // expose public api
    return {
        setup,
        reset,
        slideTo,
        returnIndex,
        prev,
        next,
        destroy
    };
}
