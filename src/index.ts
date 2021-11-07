/* eslint-disable @typescript-eslint/no-explicit-any */
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
  pathAlias?: { abc: string | RegExp } | { [s: string]: string | RegExp };
}
export interface Criterion {
  is: boolean | RegExp;
  key: boolean | RegExp | string;
  negate: boolean;
  valueReg: boolean | undefined;
  checkString?: (arg: string) => boolean;
  checkNumber?: (arg: number) => boolean;
}
export interface ArrayType {
  a?: string;
  b?: string;
  c?: string[];
  d?: {
    e?: number;
    f?: {
      g?: string[];
    };
  };
  i?: string[];
  neg?: number;
  spec?: string;
  bool?: boolean;
}
/**
 *
 * filter.
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
 * @returns ArrayType.
 */
export function filter(
  array: ArrayType[]|string[]|number[]|{[s:string|number]:any},
  options: OptionsType|undefined = {},
){
  let result= [];

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
