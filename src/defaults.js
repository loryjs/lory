export default {
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
    classNameNextCtrl: 'js_next',

    /**
     * class name for current active slide
     * if emptyString then no class is set
     * @classNameActiveSlide {string}
     */
    classNameActiveSlide: 'active',

    /**
     * enables mouse events for swiping on desktop devices
     * @enableMouseEvents {boolean}
     */
    enableMouseEvents: false,

    /**
     * window instance
     * @window {object}
     */
    window: window,

    /**
     * If false, slides lory to the first slide on window resize.
     * @rewindOnResize {boolean}
     */
    rewindOnResize: true
};
