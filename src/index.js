import escapeRegExp from 'lodash.escaperegexp';

import getCheckNumber from './getCheckNumber';
import getCheckString from './getCheckString';
import parseKeywords from './parseKeywords';

/**
 *
 * @param {Array} array
 * @param {object} [options={}]
 * @param {number} [options.limit=Infinity]
 * @param {boolean} [options.caseSensitive=false]
 * @param {string|Array} [options.keywords=[]]
 * @param {boolean} [options.index=false] Returns the indices in the array that match
 * @param {boolean} [options.predicate='AND'] Could be either AND or OR
 */
export function filter(array, options = {}) {
  let result = [];

  let { index = false, predicate = 'AND' } = options;

  let limit = options.limit ? options.limit : Infinity;

  let keywords = options.keywords || [];

  let insensitive = options.caseSensitive ? '' : 'i';
  if (typeof keywords === 'string') {
    keywords = parseKeywords(keywords);
  }
  keywords = keywords.map((keyword) => {
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
          // a property path exists
          criterion.is = new RegExp(
            `(^|\\.)${escapeRegExp(value)}(\\.|$)`,
            insensitive,
          );
        }
        criterion.key = new RegExp(
          `(^|\\.)${escapeRegExp(key)}(\\.|$)`,
          insensitive,
        );
      }
      fillCriterion(criterion, value, insensitive);
    } else {
      fillCriterion(criterion, keyword, insensitive);
    }

    return criterion;
  });

  let matched = 0;
  for (let i = 0; i < array.length && matched < limit; i++) {
    if (match(array[i], keywords, predicate)) {
      matched = result.push(index ? i : array[i]);
    }
  }
  return result;
}

function fillCriterion(criterion, keyword, insensitive) {
  criterion.checkString = getCheckString(keyword, insensitive);
  criterion.checkNumber = getCheckNumber(keyword);
}

export function match(element, keywords, predicate) {
  if (keywords.length) {
    let found = false;
    for (let i = 0; i < keywords.length; i++) {
      // match XOR negate
      if (
        recursiveMatch(element, keywords[i], [])
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

function recursiveMatch(element, keyword, keys) {
  if (typeof element === 'object') {
    if (Array.isArray(element)) {
      for (let i = 0; i < element.length; i++) {
        if (recursiveMatch(element[i], keyword, keys)) {
          return true;
        }
      }
    } else {
      for (let i in element) {
        keys.push(i);
        let didMatch = recursiveMatch(element[i], keyword, keys);
        keys.pop();
        if (didMatch) return true;
      }
    }
  } else if (keyword.is) {
    // we check for the presence of a key (jpath)
    if (keyword.is.test(keys.join('.'))) {
      return !!element;
    } else {
      return false;
    }
  } else {
    // need to check if keys match
    if (keyword.key && !keyword.key.test(keys.join('.'))) return false;
    //if (key && keyword.key && key !== keyword.key) return false;
    return nativeMatch(element, keyword);
  }
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
