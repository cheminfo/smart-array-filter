'use strict';

module.exports = filter;
module.exports.match = match;

function filter(array, options) {
    options = options || {};
    var result = [];

    var insensitive = options.caseSensitive ? '' : 'i';
    var keywords = options.keywords;
    if (typeof keywords === 'string') {
        keywords = keywords.split(/[ ;,\t\r\n]+/);
    }
    keywords = keywords.map(function (keyword) {
        var negate;
        if (keyword.charAt(0) === '-') {
            negate = true;
            keyword = keyword.substring(1);
        } else {
            negate = false;
        }
        var colon = keyword.indexOf(':');
        var key = false;
        var valueReg;
        if (colon > -1) {
            if (colon > 0) {
                key = keyword.substring(0, colon);
            }
            valueReg = new RegExp(keyword.substring(colon + 1), insensitive);
        } else {
            valueReg = new RegExp(keyword, insensitive);
        }

        return {
            negate: negate,
            key: key,
            valueReg: valueReg
        };
    });
    for (var i = 0; i < array.length; i++) {
        if (match(array[i], keywords, options.predicate || 'AND')) {
            result.push(array[i]);
        }
    }
    return result;
}

function match(element, keywords, predicate) {
    var found = false;
    if (keywords) {
        for (var i = 0; i < keywords.length; i++) {
            // match XOR negate
            if (recursiveMatch(element, keywords[i]) ? !keywords[i].negate : keywords[i].negate) {
                if (predicate === 'OR') {
                    return true;
                }
                found = true;
            } else if (predicate === 'AND') {
                return false;
            }
        }
    }
    return found;
}

function recursiveMatch(element, keyword, key) {
    if (typeof element === 'object') {
        if (Array.isArray(element)) {
            for (var i = 0; i < element.length; i++) {
                if (recursiveMatch(element[i], keyword)) {
                    return true;
                }
            }
        } else {
            for (var i in element) {
                if (recursiveMatch(element[i], keyword, i)) {
                    return true;
                }
            }
        }
    } else {
        if (key && keyword.key && key !== keyword.key) return false;
        if (typeof element === 'string') {
            return keyword.valueReg.test(element);
        } else if (typeof element === 'number') {
            return keyword.valueReg.test(String(element));
        }
    }
    return false;
}
