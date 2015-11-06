'use strict';

var chemicals = require('./chemicals.json');
var filter = require('..');

describe.only('chemicals tests', function () {
    it('string matching', function () {
        assert('', 200);
        assert('brand:FisherSci', 29);
        assert('Cetrimonium', 3);
    });

    it('numbers', function () {
        assert('mp:230', 6);
        assert('price1:<0', 0);
        assert('price1:<50', 85);
        assert('price1:>=50', 99);
    });
});

function assert(keywords, length) {
    filter(chemicals, {keywords: keywords}).should.have.lengthOf(length);
}
