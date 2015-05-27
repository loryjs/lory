/* globals it, describe, before, beforeEach, assert, lory, fixture */

'use strict';

describe('.lory()', function () {
    var instance;
    var element;

    before(function () {
        fixture.setBase('test');
    });

    beforeEach(function () {
        this.result = fixture.load('test.html');

        element  = fixture.el.querySelector('.js_simple');
        instance = lory(element);
    });

    it('has to be a function', function () {
        assert.typeOf(lory, 'function');
    });

    it('has to return an object', function () {
        assert.typeOf(lory(element), 'object');
    });
});

describe('.setup()', function () {
    var instance;
    var element;

    before(function () {
        fixture.setBase('test');
    });

    beforeEach(function () {
        this.result = fixture.load('test.html');

        element  = fixture.el.querySelector('.js_simple');
        instance = lory(element);
    });

    it('has to be a function', function () {
        assert.typeOf(instance.setup, 'function');
    });
});

describe('.slideTo()', function () {
    var instance;
    var element;

    before(function () {
        fixture.setBase('test');
    });

    beforeEach(function () {
        this.result = fixture.load('test.html');

        element  = fixture.el.querySelector('.js_simple');
        instance = lory(element);
    });

    it('has to be a function', function () {
        assert.typeOf(instance.slideTo, 'function');
    });
});

describe('.reset()', function () {
    var instance;
    var element;

    before(function () {
        fixture.setBase('test');
    });

    beforeEach(function () {
        this.result = fixture.load('test.html');

        element  = fixture.el.querySelector('.js_simple');
        instance = lory(element);
    });

    it('has to be a function', function () {
        assert.typeOf(instance.reset, 'function');
    });
});

describe('.returnIndex()', function () {
    var instance;
    var element;

    before(function () {
        fixture.setBase('test');
    });

    beforeEach(function () {
        this.result = fixture.load('test.html');

        element  = fixture.el.querySelector('.js_simple');
        instance = lory(element);
    });

    it('has to be a function', function () {
        assert.typeOf(instance.returnIndex, 'function');
    });

    it('has to return a number', function () {
        assert.typeOf(instance.returnIndex(), 'number');
    });

    it('has to return 0', function () {
        assert.equal(instance.returnIndex(), 0);
    });
});

describe('.next()', function () {
    var instance;
    var element;

    before(function () {
        fixture.setBase('test');
    });

    beforeEach(function () {
        this.result = fixture.load('test.html');

        element  = fixture.el.querySelector('.js_simple');
        instance = lory(element);
    });

    it('has to be a function', function () {
        assert.typeOf(instance.next, 'function');
    });

    it('has to return the maximum count of slides', function () {
        for (var i = 0; i < 8; i += 1) {
            instance.next();
        }

        assert.equal(instance.returnIndex(), 5);
    });
});

describe('.prev()', function () {
    var instance;
    var element;

    before(function () {
        fixture.setBase('test');
    });

    beforeEach(function () {
        this.result = fixture.load('test.html');

        element  = fixture.el.querySelector('.js_simple');
        instance = lory(element);
    });

    it('has to be a function', function () {
        assert.typeOf(instance.prev, 'function');
    });

    it('has to return the minimum count of slides', function () {
        for (var i = 0; i < 8; i += 1) {
            instance.prev();
        }

        assert.equal(instance.returnIndex(), 0);
    });
});
