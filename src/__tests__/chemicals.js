'use strict';

var chemicals = require('./chemicals.json');
var filter = require('..');

describe('chemicals tests', function () {
    it('string matching', function () {
        assert('', 200);
        assert('brand:FisherSci', 29);
        assert('Cetrimonium', 3);
        assert('=Formaldehyde', 7)
    });

    it('numbers', function () {
        assert('mp:=230', 3);
        assert('price1:<0', 0);
        assert('price1:<0', 0, {limit: 100});
        assert('price1:<50', 85);
        assert('price1:<50', 50, {limit: 50});
        assert('price1:<50', 85, {limit: 100});
        assert('price1:>=50', 99);
        assert('mp:230..230', 3);
        assert('mw:30..31', 7);
        assert('idontexist:', 0);
    });
});

function assert(keywords, length, options) {
    options = Object.assign({keywords: keywords}, options);
    filter(chemicals, options).should.have.lengthOf(length);
}
