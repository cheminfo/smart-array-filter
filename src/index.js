import escapeRegExp from 'lodash.escaperegexp';

import match from './match/match';
import convertKeywordsToCriteria from './utils/convertKeywordsToCriteria';
import ensureObjectOfRegExps from './utils/ensureObjectOfRegExps';
import parseKeywords from './utils/parseKeywords';

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
  ignorePaths = ignorePaths.map((path) =>
    typeof path === 'string'
      ? new RegExp(`(^|\\.)${escapeRegExp(path)}(\\.|$)`, insensitive)
      : path,
  );

  let limit = options.limit ? options.limit : Infinity;

  let keywords = options.keywords || [];

  if (typeof keywords === 'string') {
    keywords = parseKeywords(keywords);
  }
  const criteria = convertKeywordsToCriteria(keywords, {
    insensitive,
    pathAlias,
  });
  let matched = 0;
  for (let i = 0; i < array.length && matched < limit; i++) {
    if (match(array[i], criteria, predicate, { ignorePaths, pathAlias })) {
      matched = result.push(index ? i : array[i]);
    }
  }
  return result;
}
