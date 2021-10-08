import escapeRegExp from 'lodash.escaperegexp';

import getCheckNumber from './getCheckNumber';
import getCheckString from './getCheckString';
import parseKeywords from './parseKeywords';

/**
 *
 * @param {Array} array array to filter
 * @param {object} [options={}]
 * @param {number} [options.limit=Infinity] Maximum number of results
 * @param {boolean} [options.caseSensitive=false] By default we ignore case
 * @param {array} [options.ignorePaths=[]] Array of jpath to ignore
 * @param {array} [options.pathAlias={}] key (string), value (string of regexp)
 * @param {string|Array} [options.keywords=[]] list of keywords used to filter the array
 * @param {boolean} [options.index=false] Returns the indices in the array that match
 * @param {boolean} [options.predicate='AND'] Could be either AND or OR
 */
export function filter(array, options = {}) {
  let result = [];

  let {
    index = false,
    predicate = 'AND',
    ignorePaths = [],
    pathAlias = {},
  } = options;
  let insensitive = options.caseSensitive ? '' : 'i';

  pathAlias = ensureObjectOfRegExps(pathAlias, { insensitive });
  ignorePaths = ignorePaths.map(
    (path) => new RegExp(`(^|\\.)${escapeRegExp(path)}(\\.|$)`, insensitive),
  );

  let limit = options.limit ? options.limit : Infinity;

  let keywords = options.keywords || [];

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
        if (pathAlias[key]) {
          criterion.key = pathAlias[key];
        } else {
          criterion.key = new RegExp(
            `(^|\\.)${escapeRegExp(key)}(\\.|$)`,
            insensitive,
          );
        }
      }
      fillCriterion(criterion, value, insensitive);
    } else {
      fillCriterion(criterion, keyword, insensitive);
    }

    return criterion;
  });
  let matched = 0;
  for (let i = 0; i < array.length && matched < limit; i++) {
    if (match(array[i], keywords, predicate, { ignorePaths, pathAlias })) {
      matched = result.push(index ? i : array[i]);
    }
  }
  return result;
}

function fillCriterion(criterion, keyword, insensitive) {
  criterion.checkString = getCheckString(keyword, insensitive);
  criterion.checkNumber = getCheckNumber(keyword);
}

export function match(element, keywords, predicate, options) {
  if (keywords.length) {
    let found = false;
    for (let i = 0; i < keywords.length; i++) {
      // match XOR negate
      if (
        recursiveMatch(element, keywords[i], [], options)
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

function recursiveMatch(element, keyword, keys, options) {
  if (typeof element === 'object') {
    if (Array.isArray(element)) {
      for (let i = 0; i < element.length; i++) {
        if (recursiveMatch(element[i], keyword, keys, options)) {
          return true;
        }
      }
    } else {
      for (let i in element) {
        keys.push(i);
        let didMatch = recursiveMatch(element[i], keyword, keys, options);
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
    const joinedKeys = keys.join('.');
    for (let ignorePath of options.ignorePaths) {
      if (ignorePath.test(joinedKeys)) return false;
    }
    if (keyword.key) {
      const key = options.pathAlias[keyword.key]
        ? options.pathAlias[keyword.key]
        : keyword.key;
      if (!key.test(joinedKeys)) return false;
    }
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

function ensureObjectOfRegExps(object, options) {
  const { insensitive } = options;
  const toReturn = {};
  for (const [key, value] of Object.entries(object)) {
    if (value instanceof RegExp) {
      toReturn[key] = value;
    } else {
      toReturn[key] = new RegExp(
        `(^|\\.)${escapeRegExp(value)}(\\.|$)`,
        insensitive,
      );
    }
  }
  return toReturn;
}
