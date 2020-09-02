import escapeRegExp from 'lodash.escaperegexp';

import { operators } from './operators';
import parseKeywords from './parseKeywords';

export function filter(array, options = {}) {
  let result = [];

  let limit = options.limit || Infinity;
  let insensitive = options.caseSensitive ? '' : 'i';
  let keywords = options.keywords || [];
  if (typeof keywords === 'string') {
    keywords = parseKeywords(keywords);
  }
  keywords = keywords.map(function (keyword) {
    let criterion = {
      is: false,
      key: false,
      negate: false,
      valueReg: undefined,
    };

    if (keyword.charAt(0) === '-') {
      criterion.negate = true;
      keyword = keyword.substring(1);
    }
    let colon = keyword.indexOf(':');
    if (colon > -1) {
      let value = keyword.substring(colon + 1);
      if (colon > 0) {
        let key = keyword.substring(0, colon);
        if (key === 'is') {
          criterion.is = new RegExp(`^${escapeRegExp(value)}$`, insensitive);
        }
        criterion.key = key;
      }
      fillCriterion(criterion, value, insensitive);
    } else {
      fillCriterion(criterion, keyword, insensitive);
    }

    return criterion;
  });

  let index = !!options.index;
  let matched = 0;
  for (let i = 0; i < array.length && matched < limit; i++) {
    if (match(array[i], keywords, options.predicate || 'AND')) {
      matched = result.push(index ? i : array[i]);
    }
  }
  return result;
}

function fillCriterion(criterion, keyword, insensitive) {
  let strKey;
  if (keyword.charAt(0) === '=') {
    strKey = `^${escapeRegExp(keyword.substring(1))}$`;
  } else {
    strKey = escapeRegExp(keyword);
  }
  let reg = new RegExp(strKey, insensitive);
  criterion.checkString = function (str) {
    return reg.test(str);
  };

  let match = /^\s*\(?\s*(<|<=|=|>=|>|\.\.)?(-?\d*\.?\d+)(?:(\.\.)(-?\d*\.?\d*))?\s*\)?\s*$/.exec(
    keyword,
  );
  let checkNumber = returnFalse;
  if (match) {
    let operator = match[1];
    let mainNumber = parseFloat(match[2]);
    let dots = match[3];
    let otherNumber = match[4];
    if (operator) {
      checkNumber = operators[operator](mainNumber);
    } else if (dots) {
      if (otherNumber !== '') {
        otherNumber = parseFloat(otherNumber);
        checkNumber = function (other) {
          return mainNumber <= other && other <= otherNumber;
        };
      } else {
        checkNumber = operators['>='](mainNumber);
      }
    } else {
      checkNumber = operators['='](mainNumber);
    }
  }

  criterion.checkNumber = checkNumber;
}

export function match(element, keywords, predicate) {
  if (keywords.length) {
    let found = false;
    for (let i = 0; i < keywords.length; i++) {
      // match XOR negate
      if (
        recursiveMatch(element, keywords[i])
          ? !keywords[i].negate
          : keywords[i].negate
      ) {
        if (predicate === 'OR') {
          return true;
        }
        found = true;
      } else if (predicate === 'AND') {
        return false;
      }
    }
    return found;
  }
  return true;
}

function recursiveMatch(element, keyword, key) {
  if (typeof element === 'object') {
    if (Array.isArray(element)) {
      for (let i = 0; i < element.length; i++) {
        if (recursiveMatch(element[i], keyword)) {
          return true;
        }
      }
    } else {
      for (let i in element) {
        if (recursiveMatch(element[i], keyword, i)) {
          return true;
        }
      }
    }
  } else if (key && keyword.is && keyword.is.test(key)) {
    return !!element;
  } else if (!keyword.is) {
    if (key && keyword.key && key !== keyword.key) return false;
    return nativeMatch(element, keyword);
  }
  return false;
}

function nativeMatch(element, keyword) {
  if (typeof element === 'string') {
    return keyword.checkString(element);
  } else if (typeof element === 'number') {
    return keyword.checkNumber(element);
  } else {
    return false;
  }
}

function returnFalse() {
  return false;
}
