import escapeRegExp from 'lodash.escaperegexp';

import match from './match/match';
import charSplit from './utils/charSplit';
import { convertKeywordsToCriteria } from './utils/convertKeywordToCriterion';
import ensureObjectOfRegExps from './utils/ensureObjectOfRegExps';
import { Json } from './utils/types';

interface OptionsTypeBase {
  keywords?: string[] | string | null;
  limit?: number;
  caseSensitive?: boolean;
  predicate?: Predicate;
  ignorePaths?: Array<RegExp | string>;
  includePaths?: Array<RegExp | string>;
  pathAlias?: Record<string, string | RegExp>;
}

export type OptionsTypeWithIndex = OptionsTypeBase & {
  index: true;
};

export type OptionsTypeWithoutIndex = OptionsTypeBase & {
  index?: false;
};

export type OptionsType = OptionsTypeWithIndex | OptionsTypeWithoutIndex;

export type Predicate = 'AND' | 'OR';

export function filter<T>(array: T[], options?: OptionsTypeWithIndex): number[];
export function filter<T>(array: T[], options?: OptionsTypeWithoutIndex): T[];
export function filter<T>(array: T[], options?: OptionsType): T[] | number[];

/**
 *
 * Filter.
 *
 * @param data - Array to filter.
 * @param [options={}] - Object.
 * @param [options.limit=Infinity] - Maximum number of results.
 * @param [options.caseSensitive=false] - By default we ignore case.
 * @param [options.ignorePaths=[]] - Array of jpath to ignore.
 * @param [options.includePaths] - Array of jpath to allow, default everything.
 * @param [options.pathAlias={}] - Key (string), value (string of regexp).
 * @param [options.keywords=[]] - List of keywords used to filter the array.
 * @param [options.index=false] - Returns the indices in the array that match.
 * @param [options.predicate='AND'] - Could be either AND or OR.
 * @returns String[] | number[].
 */
export function filter(
  data: Json[],
  options: OptionsType = {},
): Json[] | number[] {
  let {
    index = false,
    predicate = 'AND',
    ignorePaths: ignorePathsOption = [],
    includePaths: includePathsOption,
    pathAlias: pathAliasOption = {},
  } = options;

  const limit = options.limit ? options.limit : Infinity;
  const insensitive = options.caseSensitive ? '' : 'i';
  let keywords = options.keywords || [];
  const pathAlias = ensureObjectOfRegExps(pathAliasOption, { insensitive });
  const ignorePaths = ignorePathsOption.map((path) =>
    typeof path === 'string'
      ? new RegExp(`(^|\\.)${escapeRegExp(path)}(\\.|$)`, insensitive)
      : path,
  );
  const includePaths = includePathsOption
    ? includePathsOption.map((path) =>
        typeof path === 'string'
          ? new RegExp(`(^|\\.)${escapeRegExp(path)}(\\.|$)`, insensitive)
          : path,
      )
    : undefined;

  if (typeof keywords === 'string') {
    keywords = charSplit(keywords, /[ \t\r\n]/);
  }
  const criteria = convertKeywordsToCriteria(keywords, {
    caseSensitive: options.caseSensitive,
    pathAlias,
  });
  let matched = 0;
  if (index) {
    const result: number[] = [];
    for (let i = 0; i < data.length && matched < limit; i++) {
      if (
        match(data[i], criteria, predicate, {
          ignorePaths,
          includePaths,
          pathAlias,
        })
      ) {
        matched = result.push(i);
      }
    }
    return result;
  } else {
    const result: Json[] = [];
    for (let i = 0; i < data.length && matched < limit; i++) {
      if (
        match(data[i], criteria, predicate, {
          ignorePaths,
          includePaths,
          pathAlias,
        })
      ) {
        matched = result.push(data[i]);
      }
    }
    return result;
  }
}
