import escapeRegExp from 'lodash.escaperegexp';

import match from './match/match.ts';
import charSplit from './utils/charSplit.ts';
import { convertKeywordsToCriteria } from './utils/convertKeywordToCriterion.ts';
import type { CustomMatcher } from './utils/customOperators.ts';
import ensureObjectOfRegExps from './utils/ensureObjectOfRegExps.ts';
import type { Json } from './utils/types.ts';

interface OptionsTypeBase {
  /**
   * List of keywords used to filter the array.
   */
  keywords?: string[] | string | null;
  /**
   * Maximum number of results.
   */
  limit?: number;
  /**
   *  Search mode for string comparisons. Case insensitive by default.
   */
  caseSensitive?: boolean;
  /**
   *  How results from different keywords are combined into the final result.
   */
  predicate?: Predicate;
  /**
   * A list of jpath to ignore. `ignorePaths` has precedence over `includePaths`.
   */
  ignorePaths?: Array<RegExp | string>;
  /**
   * A list of jpath to limit the search to. By default the entire data object is searched recursively.
   */
  includePaths?: Array<RegExp | string>;
  /**
   * List of aliases to certain object paths.
   * The key is the alias and the value is the object path, which can be a regular expression.
   */
  pathAlias?: Record<string, string | RegExp>;
  /**
   * List of custom matchers which converts search expressions into matchers.
   */
  customMatchers?: CustomMatcher[];
}

export type OptionsTypeWithIndex = OptionsTypeBase & {
  /**
   * Returns the indices in the array that match, instead of the elements themselves.
   */
  index: true;
};

export type OptionsTypeWithoutIndex = OptionsTypeBase & {
  index?: false;
};

export type OptionsType = OptionsTypeWithIndex | OptionsTypeWithoutIndex;

export type Predicate = 'AND' | 'OR';

export function filter(array: Json[], options?: OptionsTypeWithIndex): number[];
export function filter<T>(array: T[], options?: OptionsTypeWithoutIndex): T[];
export function filter<T>(array: T[], options?: OptionsType): T[] | number[];

/**
 * Filter an data list.
 */
export function filter(
  /**
   *  Input array to filter.
   */
  data: Json[],
  /**
   * Filter options.
   */
  options: OptionsType = {},
): Json[] | number[] {
  const {
    index = false,
    predicate = 'AND',
    ignorePaths: ignorePathsOption = [],
    includePaths: includePathsOption,
    pathAlias: pathAliasOption = {},
  } = options;

  const { customMatchers = [] } = options;
  const limit = options.limit || Infinity;
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
    keywords = charSplit(keywords, /[\t\n\r ]/);
  }
  const criteria = convertKeywordsToCriteria(keywords, {
    caseSensitive: options.caseSensitive,
    pathAlias,
    customOperators: customMatchers,
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
