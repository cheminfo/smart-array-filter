'use strict';

var operators = {
    '<': function (value) {
        return function (other) {
            return other < value;
        }
    },
    '<=': function (value) {
        return function (other) {
            return other <= value;
        }
    },
    '=': function (value) {
        return function (other) {
            return other === value;
        }
    },
    '>=': function (value) {
        return function (other) {
            return other >= value;
        }
    },
    '>': function (value) {
        return function (other) {
            return other > value;
        }
    }
};

operators['..'] = operators['<='];

module.exports = operators;
