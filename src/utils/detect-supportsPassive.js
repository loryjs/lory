export default function detectSupportsPassive () {
    let supportsPassive = false;

    try {
        let opts = Object.defineProperty({}, 'passive', {
            get () {
                supportsPassive = true;
            }
        });

        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
    } catch (e) {}

    return supportsPassive;
}
