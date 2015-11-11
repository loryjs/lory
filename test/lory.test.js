/* globals it, describe, before, beforeEach, assert, lory, fixture */

'use strict';

describe('lory()', function () {
    var instance;
    var element;

    before(function () {
        fixture.setBase('test');
    });

    beforeEach(function () {
        this.result = fixture.load('test.html');
        element  = fixture.el.querySelector('.js_simple');
    });

    it('has to be a function', function () {
        assert.typeOf(lory, 'function');
    });

    it('has to return an object', function () {
        assert.typeOf(lory(element), 'object');
    });

    describe('.setup()', function () {
        beforeEach(function () {
            instance = lory(element);
        });

        it('has to be a function', function () {
            assert.typeOf(instance.setup, 'function');
        });
    });

    describe('.slideTo()', function () {
        beforeEach(function () {
            instance = lory(element);
        });

        it('has to be a function', function () {
            assert.typeOf(instance.slideTo, 'function');
        });
    });

    describe('.reset()', function () {
        beforeEach(function () {
            instance = lory(element);
        });

        it('has to be a function', function () {
            assert.typeOf(instance.reset, 'function');
        });
    });

    describe('.returnIndex()', function () {
        beforeEach(function () {
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
        beforeEach(function () {
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

    describe('.next() called 2x', function() {
        var expectedOffset;

        beforeEach(function () {
            expectedOffset = (element.querySelector('.js_slide').offsetWidth * 2 + 20) * -1;
            instance = lory(element);
        });

        it('offset has to be the expectedOffset', function() {
            for (var i = 0; i < 2; i++) {
                instance.next();
            }

            assert.equal(instance.returnIndex(), 2);
        });
    });

    describe('.next() called 4x', function() {
        var expectedOffset;

        beforeEach(function () {
            expectedOffset = (element.querySelector('.js_slide').offsetWidth + 10) * -4;
            instance = lory(element);
        });

        it('offset has to be the expectedOffset', function() {

            for (var i = 0; i < 4; i++) {
                instance.next();
            }

            assert.equal(instance.returnIndex(), 4);
        });
    });

    describe('.prev()', function () {
        beforeEach(function () {
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

    describe('.prev() called 2x without infinite', function() {
        var expectedOffset;

        beforeEach(function () {
            expectedOffset = 0;
            instance = lory(element);
        });

        it('offset has to be the expectedOffset', function() {
            for (var i = 0; i < 2; i++) {
                instance.prev();
            }

            assert.equal(instance.returnIndex(), 0);
        });
    });

    describe('.prev() called 4x without infinite', function() {
        var expectedOffset;

        beforeEach(function () {
            expectedOffset = 0;
            instance = lory(element);
        });

        it('offset has to be the expectedOffset', function() {
            for (var i = 0; i < 4; i++) {
                instance.prev();
            }

            assert.equal(instance.returnIndex(), 0);
        });
    });

    describe('.prev() called 2x with infinite', function() {
        var expectedOffset;

        beforeEach(function () {
            // has to be at slide 5
            expectedOffset = (element.querySelector('.js_slide').offsetWidth + 10) * -5;

            instance = lory(element, {
                infinite: true
            });
        });

        it('offset has to be the expectedOffset', function() {
            for (var i = 0; i < 2; i++) {
                instance.prev();
            }

            assert.equal(instance.returnIndex(), 5);
        });
    });

    describe('.prev() called 4x with infinite', function() {
        var expectedOffset;

        beforeEach(function () {
            // has to be at slide 3
            expectedOffset = (element.querySelector('.js_slide').offsetWidth + 10) * -3;

            instance = lory(element, {
                infinite: true
            });
        });

        it('offset has to be the expectedOffset', function() {
            for (var i = 0; i < 4; i++) {
                instance.prev();
            }

            assert.equal(instance.returnIndex(), 3);
        });
    });

    describe('.destroy()', function () {
        beforeEach(function () {
            instance = lory(element);
        });

        it('has to be a function', function () {
            assert.typeOf(instance.destroy, 'function');
        });
    });
});
