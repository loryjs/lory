/**
 * Detecting prefixes for saving time and bytes
 */
export default function detectPrefixes () {
    let transform;
    let transition;
    let transitionEnd;

    (function () {
        let style = document.createElement('_')
            .style;

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
    }());

    return {
        transform: transform,
        transition: transition,
        transitionEnd: transitionEnd
    };
}
