import escapeRegExp from 'lodash.escaperegexp';

import type { CustomOperator } from './customOperators.js';
import type { NumberMatcher } from './getCheckNumber.ts';
import getCheckNumber from './getCheckNumber.ts';
import type { ObjectMatcher } from './getCheckObject.ts';
import getCheckObject from './getCheckObject.ts';
import type { StringMatcher } from './getCheckString.ts';
import getCheckString from './getCheckString.ts';

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
  stringMatchers: StringMatcher[];
  numberMatchers: NumberMatcher[];
  objectMatchers?: ObjectMatcher[];
}

export type Criterion = KeyCriterion | ValueCriterion;

/**
 * @internal
 */
export function convertKeywordToCriterion(
  keyword: string,
  options: {
    caseSensitive?: boolean;
    pathAlias?: Record<string, RegExp>;
    customOperators: CustomOperator[];
  } = { customOperators: [] },
): Criterion {
  const hasObjectCheck = options.customOperators?.some(
    (op) => op.createObjectMatcher,
  );
  const { caseSensitive, pathAlias = {} } = options;
  const regexpFlags = caseSensitive ? '' : 'i';

  let negate = false;
  if (keyword.startsWith('-')) {
    negate = true;
    keyword = keyword.slice(1);
  }
  const colon = keyword.indexOf(':');
  if (colon !== -1) {
    const value = keyword.slice(Math.max(0, colon + 1));
    if (colon > 0) {
      const key = keyword.slice(0, Math.max(0, colon));
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
          key:
            pathAlias[key] ||
            new RegExp(`(^|\\.)${escapeRegExp(key)}(\\.|$)`, regexpFlags),
          numberMatchers: getCheckNumber(value, options.customOperators),
          stringMatchers: getCheckString(
            value,
            regexpFlags,
            options.customOperators,
          ),
          objectMatchers: hasObjectCheck
            ? getCheckObject(value, options.customOperators)
            : undefined,
        };
      }
    }
  }
  return {
    type: 'matches',
    negate,
    numberMatchers: getCheckNumber(keyword, options.customOperators),
    stringMatchers: getCheckString(
      keyword,
      regexpFlags,
      options.customOperators,
    ),
    objectMatchers: hasObjectCheck
      ? getCheckObject(keyword, options.customOperators)
      : undefined,
  };
}

export function convertKeywordsToCriteria(
  keywords: string[],
  options: {
    caseSensitive?: boolean;
    pathAlias?: Record<string, RegExp>;
    customOperators: CustomOperator[];
  },
): Criterion[] {
  return keywords.map((keyword) => {
    return convertKeywordToCriterion(keyword, options);
  });
}
