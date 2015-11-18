/* globals it, describe, before, beforeEach, assert, lory, fixture */

'use strict';

describe('lory()', function () {
    var instance;
    var element;
    var slideMargin = 10;
    var transitionEnd = whichTransitionEndProp();

    function whichTransitionEndProp() {
        var el = document.createElement('fakeelement');
        var transitionEndProps = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        }
        for (var transition in transitionEndProps) {
            if (el.style[transition] !== undefined) {
                return transitionEndProps[transition];
            }
        }
    }

    function waitForTransitionEnd(fn, done) {
        var slideContainer = getSlideContainer();
        var listener = function() {
            fn();
            slideContainer.removeEventListener(transitionEnd, listener);
            done && done();
        };
        slideContainer.addEventListener(transitionEnd, listener);
    }

    function getSlideContainer() {
        return element.querySelector('.js_slides');
    }

    function getActualOffset() {
        var slideContainer = getSlideContainer();
        var parentOffset = slideContainer.offsetParent.getBoundingClientRect().left;
        var elementOffset = slideContainer.getBoundingClientRect().left;
        return (parentOffset - elementOffset) * -1;
    }

    function getExpectedOffset(leftOffsetSlideCount) {
        var slideWidth = element.querySelector('.js_slide').offsetWidth;
        return (slideWidth + slideMargin) * -leftOffsetSlideCount;
    }

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

        describe('without infinite', function () {
            it('has to return 0', function () {
                assert.equal(instance.returnIndex(), 0);
            });
        });

        describe('with infinite', function () {
            beforeEach(function () {
                instance = lory(element, {
                    infinite: 1
                });
            });

            it('has to return 0', function () {
                assert.equal(instance.returnIndex(), 0);
            });
        });
    });

    describe('.next()', function () {
        beforeEach(function () {
            instance = lory(element);
        });

        it('has to be a function', function () {
            assert.typeOf(instance.next, 'function');
        });

        describe('called 2x', function() {
            var expectedIndex = 2;

            beforeEach(function () {
                instance.next();
                instance.next();
            });

            it('translates the slides container 2 slides to the left', function(done) {
                waitForTransitionEnd(function() {
                    assert.equal(getActualOffset(), getExpectedOffset(2));
                }, done);
            });

            it('index has to be 2, i.e. 3rd slide', function () {
                assert.equal(instance.returnIndex(), expectedIndex);
            });
        });

        describe('without infinite', function () {
            var expectedIndex = 5;

            describe('called 6x', function() {
                beforeEach(function () {
                    for (var i = 0; i < 6; i += 1) {
                        instance.next();
                    }
                });

                it('translates the slides container 5 slides to the left', function(done) {
                    waitForTransitionEnd(function() {
                        assert.equal(getActualOffset(), getExpectedOffset(5));
                    }, done);
                });

                it('index has to be 5, i.e. last slide', function () {
                    assert.equal(instance.returnIndex(), expectedIndex);
                });
            });
        });

        describe('with infinite', function () {
            beforeEach(function () {
                instance = lory(element, {
                    infinite: 1
                });
            });

            describe('called 6x', function() {
                var expectedIndex = 0;

                beforeEach(function () {
                    for (var i = 0; i < 6; i += 1) {
                        instance.next();
                    }
                });

                it('translates the slides container 1 slide to the left', function(done) {
                    waitForTransitionEnd(function() {
                        assert.equal(getActualOffset(), getExpectedOffset(1));
                    }, done);
                });

                it('index has to be 0, i.e. first slide', function () {
                    assert.equal(instance.returnIndex(), expectedIndex);
                });
            });
        });
    });

    describe('.prev()', function() {
        beforeEach(function () {
            instance = lory(element);
        });

        it('has to be a function', function () {
            assert.typeOf(instance.prev, 'function');
        });

        describe('without infinite', function () {
            describe('called once', function () {
                var expectedIndex = 0;

                beforeEach(function () {
                    instance.prev();
                });

                it('does not translate the slides container', function() {
                    assert.equal(getActualOffset(), getExpectedOffset(0));
                });

                it('index has to be 0 (i.e. 1st slide)', function() {
                    assert.equal(instance.returnIndex(), 0);
                });
            });

            describe('called once after next()', function () {
                var expectedIndex = 0;

                beforeEach(function (done) {
                    instance.next();
                    // setTimeout is needed to simulate two separate clicks,
                    // otherwise the two transitions cancel each other out
                    window.setTimeout(function() {
                        instance.prev();
                        done();
                    }, 50);
                });

                it('translates the slides container back to the first slide', function(done) {
                    waitForTransitionEnd(function() {
                        assert.equal(getActualOffset(), getExpectedOffset(0));
                    }, done);
                });

                it('index has to be 0 (i.e. 1st slide)', function() {
                    assert.equal(instance.returnIndex(), expectedIndex);
                });
            });

            describe('called once after next() was called 2x', function () {
                var expectedIndex = 1;

                beforeEach(function () {
                    instance.next();
                    instance.next();
                    instance.prev();
                });

                it('translates the slides container 1 slide to the left', function(done) {
                    waitForTransitionEnd(function() {
                        assert.equal(getActualOffset(), getExpectedOffset(1));
                    }, done);
                });

                it('index has to be 1 (i.e. 2nd slide)', function() {
                    assert.equal(instance.returnIndex(), expectedIndex);
                });
            });
        });

        describe('with infinite', function () {
            beforeEach(function () {
                instance = lory(element, {
                    infinite: 1
                });
            });

            describe('called zero times', function() {
                var expectedIndex = 0;

                it('translates the slides container 1 slide to the left', function() {
                    assert.equal(getActualOffset(), getExpectedOffset(1));
                });

                it('index has to be 0 (i.e. 1st slide)', function() {
                    assert.equal(instance.returnIndex(), expectedIndex);
                });
            });

            describe('called once', function() {
                var expectedIndex = 5;

                beforeEach(function () {
                    instance.prev();
                });

                it('translates the slides container 6 slides to the left', function(done) {
                    waitForTransitionEnd(function() {
                        assert.equal(getActualOffset(), getExpectedOffset(6));
                    }, done);
                });

                it('index has to be 5 (i.e. 6th slide)', function() {
                    assert.equal(instance.returnIndex(), expectedIndex);
                });
            });

            describe('called 4x', function() {
                var expectedIndex = 2;

                beforeEach(function () {
                    for (var i = 0; i < 4; i++) {
                        instance.prev();
                    }
                });

                it('translates the slides container 3 slides to the left', function(done) {
                    waitForTransitionEnd(function() {
                        assert.equal(getActualOffset(), getExpectedOffset(3));
                    }, done);
                });

                it('index has to be 2 (i.e. 3rd slide)', function() {
                    assert.equal(instance.returnIndex(), expectedIndex);
                });
            });
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

    describe('.onResize()', function () {
        var resizeListener;
        var indexAfterResize;
        var onResizeCallback = function() {
            indexAfterResize = instance.returnIndex();
        };

        beforeEach(function () {
            instance = lory(element, {
                window: {
                    addEventListener: function(type, listener) {
                        if (type == 'resize') {
                            resizeListener = listener;
                        }
                    }
                }
            });
            element.addEventListener('on.lory.resize', onResizeCallback);
        });

        afterEach(function () {
            element.removeEventListener('on.lory.resize', onResizeCallback);
        });

        it('has to dispatch the event on.lory.resize after reset()', function () {
            instance.next();
            resizeListener();
            assert.equal(indexAfterResize, 0);
        });
    });
});
