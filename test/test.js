'use strict';

var filter = require('..');

var test = [
    {
        a: 'a',
        b: 'b',
        c: ['pppcpp', 'D'],
        d: {
            e: 123,
            f: {
                g: ['h']
            }
        }
    },
    {
        h: 'h',
        i: ['jkl'],
        m: {
            n: {
                O: 'OoO'
            }
        }
    }
];

describe('filter', function () {
    it('1 keyword, OR', function () {
        assert({keywords: ['a'], predicate: 'OR'}, 1);
        assert({keywords: ['C'], predicate: 'OR'}, 1);
        assert({keywords: ['d'], predicate: 'OR'}, 1);
        assert({keywords: ['oo'], predicate: 'OR'}, 1);
        assert({keywords: ['23'], predicate: 'OR'}, 1);
        assert({keywords: ['h'], predicate: 'OR'}, 2);
        assert({keywords: ['z'], predicate: 'OR'}, 0);
    });

    it('1 keyword, AND', function () {
        assert({keywords: ['a']}, 1);
        assert({keywords: ['a'], predicate: 'AND'}, 1);
        assert({keywords: ['c'], predicate: 'AND'}, 1);
        assert({keywords: ['d'], predicate: 'AND'}, 1);
        assert({keywords: ['12'], predicate: 'AND'}, 1);
        assert({keywords: ['h'], predicate: 'AND'}, 2);
        assert({keywords: ['z'], predicate: 'AND'}, 0);
    });

    it('2 keywords, OR', function () {
        assert({keywords: ['a', 'b'], predicate: 'OR'}, 1);
        assert({keywords: ['c', '23'], predicate: 'OR'}, 1);
        assert({keywords: ['d', 'x'], predicate: 'OR'}, 1);
        assert({keywords: ['x', '1'], predicate: 'OR'}, 1);
        assert({keywords: ['x', 'y'], predicate: 'OR'}, 0);
    });

    it('2 keywords, AND', function () {
        assert({keywords: ['a', 'b']}, 1);
        assert({keywords: ['a', 'b'], predicate: 'AND'}, 1);
        assert({keywords: ['c', '2'], predicate: 'AND'}, 1);
        assert({keywords: ['d', 'x'], predicate: 'AND'}, 0);
        assert({keywords: ['x', '3'], predicate: 'AND'}, 0);
        assert({keywords: ['x', 'y'], predicate: 'AND'}, 0);
    });

    it('case sensitive', function () {
        assert({keywords: ['kl', 'oO'], caseSensitive: true}, 1);
        assert({keywords: ['kl', 'oo'], caseSensitive: true}, 0);
    });

    it('exclusion', function () {
        assert({keywords: ['-a']}, 1);
        assert({keywords: ['-h']}, 0);
        assert({keywords: ['-oo']}, 1);
        assert({keywords: ['-xzfe']}, 2);
    });

    it('with property name', function () {
        assert({keywords: ['a:a']}, 1);
        assert({keywords: ['A:a']}, 0);
        assert({keywords: ['a:A']}, 1);
        assert({keywords: ['a:b']}, 0);
        assert({keywords: ['e:23']}, 1);
    });

    it('complex', function () {
        assert({keywords: 'a:a -x:aoe, e:12;  -o:bae   '}, 1);
        assert({keywords: ['a:a', '-x:aoe', 'e:12', '-o:bae']}, 1);
    });

    it('array of primitives', function () {
        assert({keywords: ['pcp']}, 1);
        assert({keywords: ['c:D']}, 1);
    });
});

function assert(options, length) {
    filter(test, options).should.have.lengthOf(length);
}
