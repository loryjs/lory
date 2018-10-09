/**
 * Detecting prefixes for saving time and bytes
 */
export default function detectPrefixes () {
    let transform;
    let transition;
    let transitionEnd;

    (function () {
        let el = document.createElement('_');
        let style = el.style;

        let prop;

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

        document.body.insertBefore(el, null);
        style[transform] = 'translateX(0)';
        document.body.removeChild(el);
    }());

    return {
        transform,
        transition,
        transitionEnd
    };
}
