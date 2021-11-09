import escapeRegExp from 'lodash.escaperegexp';

import match from './match/match';
import convertKeywordsToCriteria from './utils/convertKeywordsToCriteria';
import ensureObjectOfRegExps from './utils/ensureObjectOfRegExps';
import parseKeywords from './utils/parseKeywords';

interface OptionsTypeBase {
  keywords?: string[] | string | null;
  limit?: number;
  caseSensitive?: boolean;
  predicate?: string;
  ignorePaths?: RegExp[] | string[];
  pathAlias?: Record<string, string | RegExp>;
}

export type OptionsTypeWithIndex = OptionsTypeBase & {
  index: true;
};

export type OptionsTypeWithoutIndex = OptionsTypeBase & {
  index?: false;
};

export type OptionsType = OptionsTypeWithIndex | OptionsTypeWithoutIndex;

export type Json =
  | string
  | number
  | boolean
  | null
  | undefined
  | Json[]
  | { [key: string]: Json };

export interface Criterion {
  is?: RegExp;
  key?: RegExp;
  negate: boolean;
  checkString: (arg: string) => boolean;
  checkNumber: (arg: number) => boolean;
}

export function filter<T extends Json>(
  array: T[],
  options?: OptionsTypeWithIndex,
): number[];
export function filter<T extends Json>(
  array: T[],
  options?: OptionsTypeWithoutIndex,
): T[];
export function filter<T extends Json>(
  array: Json[],
  options?: OptionsType,
): T[] | number[];

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
  array: Json[],
  options: OptionsType = {},
): Json[] | number[] {
  const result = [];

  let {
    index = false,
    predicate = 'AND',
    ignorePaths = [],
    pathAlias: pathAliasOption = {},
  } = options;

  const limit = options.limit ? options.limit : Infinity;
  const insensitive = options.caseSensitive ? '' : 'i';
  let keywords = options.keywords || [];
  const pathAlias = ensureObjectOfRegExps(pathAliasOption, { insensitive });
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
