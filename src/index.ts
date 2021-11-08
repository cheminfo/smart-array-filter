import escapeRegExp from 'lodash.escaperegexp';

import match from './match/match';
import convertKeywordsToCriteria from './utils/convertKeywordsToCriteria';
import ensureObjectOfRegExps from './utils/ensureObjectOfRegExps';
import parseKeywords from './utils/parseKeywords';

export interface OptionsType {
  keywords?: string[] | string | null;
  limit?: number;
  caseSensitive?: boolean;
  index?: boolean;
  insensitive?: string;
  predicate?: string;
  ignorePaths?: RegExp[] | string[];
  pathAlias?: { abc: string | RegExp } | Record<string, string | RegExp>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Data = string[] | number[] | Record<string | number, any>;
export interface Criterion {
  is: boolean | RegExp;
  key: boolean | RegExp | string;
  negate: boolean;
  valueReg: boolean | undefined;
  checkString: (arg: string) => boolean;
  checkNumber: (arg: number) => boolean;
}
/**
 *
 * Filter.
 *
 * @param array - Array to filter.
 * @param [options={}] - Object.
 * @param [options.limit=Infinity] - Maximum number of results.
 * @param [options.caseSensitive=false] - By default we ignore case.
 * @param [options.ignorePaths=[]] - Array of jpath to ignore.
 * @param [options.pathAlias={}] - Key (string), value (string of regexp).
 * @param [options.keywords=[]] - List of keywords used to filter the array.
 * @param [options.index=false] - Returns the indices in the array that match.
 * @param [options.predicate='AND'] - Could be either AND or OR.
 * @returns String[] | number[].
 */
export function filter(
  array: Data,
  options: OptionsType = {},
): string[] | number[] {
  const result = [];

  let {
    index = false,
    predicate = 'AND',
    ignorePaths = [],
    pathAlias = {},
  } = options;

  const limit = options.limit ? options.limit : Infinity;
  const insensitive = options.caseSensitive ? '' : 'i';
  let keywords = options.keywords || [];
  pathAlias = ensureObjectOfRegExps(pathAlias, { insensitive });
  ignorePaths = ignorePaths.map((path) =>
    typeof path === 'string'
      ? new RegExp(`(^|\\.)${escapeRegExp(path)}(\\.|$)`, insensitive)
      : path,
  );

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
