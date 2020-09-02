'use strict';

var parseKeywords = require('../src/parseKeywords');

describe('parseKeywords', function () {
    it('simple cases', function () {
        assert('a', ['a']);
        assert('a b', ['a', 'b']);
        assert('a b;c,d  e', ['a', 'b', 'c', 'd', 'e']);
        assert('x:y;z, ;\t t', ['x:y', 'z', 't']);
    });
    it('with quotes', function () {
        assert('"aei"', ['aei']);
        assert('"a e i"', ['a e i']);
        assert('"""hello"""', ['"hello"']);
        assert('"my prop":"my value"', ['my prop:my value']);
        assert('   a:"bc"""" "" de"  e ', ['a:bc"" " de', 'e']);
    });
});

function assert(keywords, result) {
    parseKeywords(keywords).should.eql(result);
}
