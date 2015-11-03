'use strict';

var filter = require('..');

var test = [{
    a: 'a',
    b: 'b',
    c: ['c', 'd'],
    d: {
        e: 'e',
        f: {
            g: ['h']
        }
    }
}];

describe('filter', function () {
    it('1 keyword, OR', function () {
        assert({keywords: ['a']}, 1);
        assert({keywords: ['a'], predicate: 'OR'}, 1);
        assert({keywords: ['c'], predicate: 'OR'}, 1);
        assert({keywords: ['d'], predicate: 'OR'}, 1);
        assert({keywords: ['e'], predicate: 'OR'}, 1);
        assert({keywords: ['h'], predicate: 'OR'}, 1);
        assert({keywords: ['z'], predicate: 'OR'}, 0);
    });

    it('1 keyword, AND', function () {
        assert({keywords: ['a'], predicate: 'AND'}, 1);
        assert({keywords: ['c'], predicate: 'AND'}, 1);
        assert({keywords: ['d'], predicate: 'AND'}, 1);
        assert({keywords: ['e'], predicate: 'AND'}, 1);
        assert({keywords: ['h'], predicate: 'AND'}, 1);
        assert({keywords: ['z'], predicate: 'AND'}, 0);
    });

    it('2 keywords, OR', function () {
        assert({keywords: ['a', 'b']}, 1);
        assert({keywords: ['a', 'b'], predicate: 'OR'}, 1);
        assert({keywords: ['c', 'e'], predicate: 'OR'}, 1);
        assert({keywords: ['d', 'x'], predicate: 'OR'}, 1);
        assert({keywords: ['x', 'e'], predicate: 'OR'}, 1);
        assert({keywords: ['x', 'y'], predicate: 'OR'}, 0);
    });

    it('2 keywords, AND', function () {
        assert({keywords: ['a', 'b'], predicate: 'AND'}, 1);
        assert({keywords: ['c', 'e'], predicate: 'AND'}, 1);
        assert({keywords: ['d', 'x'], predicate: 'AND'}, 0);
        assert({keywords: ['x', 'e'], predicate: 'AND'}, 0);
        assert({keywords: ['x', 'y'], predicate: 'AND'}, 0);
    });
});

function assert(options, length) {
    filter(test, options).should.have.lengthOf(length);
}
