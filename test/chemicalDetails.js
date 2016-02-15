'use strict';

var chemicals = require('./chemicalDetails.json');
var filter = require('..');

describe('chemicalDetails tests', function () {

    it('string matching', function () {
        assert('', 4);
        assert('origsurediphenyle', 1);
    });


    it('numbers', function () {
        assert('price:<10', 4);
        assert('price:<1', 1);
        assert('price:1..2', 3);
        assert('price:>1000', 1);
        assert('pressure:760', 2);
        assert('exactMass:234..235', 1);
        assert('quantity:1g', 4);
    });

    it('decimal numbers', function () {
        assert('mw:132.16192', 1);
        assert('price:>200.5', 2);
        assert('mw:39.9..40.0', 1);
    });

});

function assert(keywords, length) {
    filter(chemicals, {keywords: keywords}).should.have.lengthOf(length);
}
