import escapeRegExp from 'lodash.escaperegexp';

import getCheckNumber from './getCheckNumber';
import getCheckString from './getCheckString';

/**
 * A criterion which checks the existence of a key
 */
export interface KeyCriterion {
  type: 'exists';
  /**
   * The regexp that should match the key. If the key does not meet the regexp,
   */
  key: RegExp;
  /**
   * Match non-existing keys instead of existing keys
   */
  negate: boolean;
}

/**
 * A criterion which optionnally matches a key and checks the value in a callback
 */
export interface ValueCriterion {
  type: 'matches';
  /**
   * The regexp that should match the key. Non matching keys are not checked
   */
  key?: RegExp;
  /**
   * Use to match anything that does not match the value
   */
  negate: boolean;
  checkString: (arg: string) => boolean;
  checkNumber: (arg: number) => boolean;
}

export type Criterion = KeyCriterion | ValueCriterion;

/**
 * @internal
 */
export function convertKeywordToCriterion(
  keyword: string,
  options: {
    caseSensitive?: boolean;
    pathAlias: Record<string, RegExp>;
  } = {
    pathAlias: {},
  },
): Criterion {
  const { caseSensitive, pathAlias } = options;
  const regexpFlags = caseSensitive ? '' : 'i';

  let negate = false;
  if (keyword.startsWith('-')) {
    negate = true;
    keyword = keyword.substring(1);
  }
  const colon = keyword.indexOf(':');
  if (colon > -1) {
    const value = keyword.substring(colon + 1);
    if (colon > 0) {
      const key = keyword.substring(0, colon);
      if (key === 'is') {
        // a property path exists
        return {
          type: 'exists',
          negate,
          key: new RegExp(`(^|\\.)${escapeRegExp(value)}(\\.|$)`, regexpFlags),
        };
      } else {
        return {
          type: 'matches',
          negate,
          key: pathAlias[key]
            ? pathAlias[key]
            : new RegExp(`(^|\\.)${escapeRegExp(key)}(\\.|$)`, regexpFlags),
          checkNumber: getCheckNumber(value),
          checkString: getCheckString(value, regexpFlags),
        };
      }
    }
  }
  return {
    type: 'matches',
    negate,
    checkNumber: getCheckNumber(keyword),
    checkString: getCheckString(keyword, regexpFlags),
  };
}

export function convertKeywordsToCriteria(
  keywords: string[],
  options: {
    caseSensitive?: boolean;
    pathAlias: Record<string, RegExp>;
  } = {
    pathAlias: {},
  },
): Criterion[] {
  return keywords.map((keyword) => {
    return convertKeywordToCriterion(keyword, options);
  });
}
