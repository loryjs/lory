
<p align="center">
  <img src="http://maximilian-heinz.de/lory-200.png" />
</p>

Please visit: <a href="http://meandmax.github.io/lory/" target="_blank">http://meandmax.github.io/lory/</a>

> Touch enabled lean slider using vanilla JavaScript &amp; latest technologies without any compromises for fallbacks.

[![license](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/meandmax/lory/master/LICENSE)
[![npm](http://img.shields.io/npm/v/lory.js.svg?style=flat)](https://www.npmjs.com/package/lory.js)

[![build](http://img.shields.io/travis/meandmax/lory/master.svg?style=flat)](https://travis-ci.org/meandmax/lory)
[![code climate](http://img.shields.io/codeclimate/github/meandmax/lory.svg?style=flat)](https://codeclimate.com/github/meandmax/lory)
[![devDependencies](http://img.shields.io/david/dev/meandmax/lory.svg?style=flat)](https://david-dm.org/meandmax/lory#info=devDependencies&view=table)

##Install with node

```
npm install --save lory
```

```javascript
var lory = require('lory');
```

##Install with bower

```
bower install lory --save
```


##Prerequisited markup

```html
<div class="slider js_simple simple">
    <div class="frame js_frame">
        <ul class="slides js_slides">
            <li class="js_slide">1</li>
            <li class="js_slide">2</li>
            <li class="js_slide">3</li>
            <li class="js_slide">4</li>
            <li class="js_slide">5</li>
            <li class="js_slide">6</li>
        </ul>
    </div>
</div>
```

##Prerequisited css

```css
  .frame {
        position: relative;
        font-size: 0;
        line-height: 0;
        overflow: hidden;
        white-space: nowrap;
    }

    .slides {
        display: inline-block;
    }

    li {
        position: relative;
        display: inline-block;
    }
```

## Integration

```js
    <script>
        'use strict';

        document.addEventListener('DOMContentLoaded', function() {
            var simple = document.querySelector('.js_simple');

            lory(simple, {
                // options going here
            });
        });
    </script>
```

## Integration of multiple sliders on one page

```javascript
    <script src="js/lory.js"></script>
    <script>
        'use strict';

        document.addEventListener('DOMContentLoaded', function() {
            Array.prototype.slice.call(document.querySelectorAll('.js_slider')).forEach(function (element, index) {
                lory(element, {});
            });
        });
    </script>
```

##Options

<table>
    <tr>
        <td>slidesToScroll</td>
        <td>slides scrolled at once</td>
        <td>default: 1</td>
    </tr>
    <tr>
        <td>slideSpeed</td>
        <td>time in milliseconds for the animation of a valid slide attempt</td>
        <td>default: 400</td>
    </tr>
    <tr>
        <td>rewindSpeed</td>
        <td>time in milliseconds for the animation of the rewind after the last slide</td>
        <td>default: 600</td>
    </tr>
    <tr>
        <td>snapBackSpeed</td>
        <td>time for the snapBack of the slider if the slide attempt was not valid</td>
        <td>default: 200</td>
    </tr>
    <tr>
        <td>ease</td>
        <td>cubic bezier easing functions: http://easings.net/de</td>
        <td>default: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'</td>
    </tr>
    <tr>
        <td>rewind</td>
        <td>if slider reached the last slide, with next click the slider goes back to the startindex.</td>
        <td>default: false</td>
    </tr>
</table>

##Callbacks

<table>
    <tr>
        <td>beforeInit:</td>
        <td>executed before initialisation (first in setup function)</td>
    </tr>
    <tr>
        <td>afterInit:</td>
        <td>executed after initialisation (end of setup function)</td>
    </tr>
    <tr>
        <td>beforePrev:</td>
        <td>executed on click of prev controls (prev function)</td>
    </tr>
    <tr>
        <td>beforeNext:</td>
        <td>executed on click of next controls (next function)</td>
    </tr>
    <tr>
        <td>beforeTouch:</td>
        <td>executed on touch attempt (touchstart)</td>
    </tr>
    <tr>
        <td>beforeResize:</td>
        <td>executed on every resize event</td>
    </tr>
</table>

## Browser Support

* Chrome
* Safari
* FireFox
* Opera
* Internet Explorer 10+

## Copyright

Copyright &copy; 2015 Maximilian Heinz, contributors. Released under the MIT, GPL licenses
