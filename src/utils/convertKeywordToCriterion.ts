import escapeRegExp from 'lodash.escaperegexp';

import type { CustomMatcher } from './customOperators.ts';
import type {
  DefaultNumberMatcher,
  NumberMatcher,
} from './getNumberMatchers.ts';
import getNumberMatchers, {
  getDefaultNumberMatcher,
} from './getNumberMatchers.ts';
import type { CustomObjectMatcher } from './getObjectMatchers.ts';
import getObjectMatchers from './getObjectMatchers.ts';
import type {
  DefaultStringMatcher,
  StringMatcher,
} from './getStringMatchers.ts';
import getStringMatchers, {
  getDefaultStringMatcher,
} from './getStringMatchers.ts';

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
  defaultStringMatcher: DefaultStringMatcher;
  defaultNumberMatcher: DefaultNumberMatcher;
  customStringMatchers: StringMatcher[];
  customNumberMatchers: NumberMatcher[];
  customObjectMatchers?: CustomObjectMatcher[];
}

export type Criterion = KeyCriterion | ValueCriterion;

interface KeywordToCriterionOptions {
  caseSensitive?: boolean;
  pathAlias?: Record<string, RegExp>;
  customOperators: CustomMatcher[];
}

/**
 * @internal
 */
export function convertKeywordToCriterion(
  keyword: string,
  options: KeywordToCriterionOptions = { customOperators: [] },
): Criterion {
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
          ...createMatchers(value, regexpFlags, options),
        };
      }
    }
  }
  return {
    type: 'matches',
    negate,
    ...createMatchers(keyword, regexpFlags, options),
  };
}

export function convertKeywordsToCriteria(
  keywords: string[],
  options: {
    caseSensitive?: boolean;
    pathAlias?: Record<string, RegExp>;
    customOperators: CustomMatcher[];
  },
): Criterion[] {
  return keywords.map((keyword) => {
    return convertKeywordToCriterion(keyword, options);
  });
}

function createMatchers(
  value: string,
  regexpFlags: string,
  options: KeywordToCriterionOptions,
) {
  return {
    customNumberMatchers: getNumberMatchers(value, options.customOperators),
    defaultNumberMatcher: getDefaultNumberMatcher(value),
    customStringMatchers: getStringMatchers(
      value,
      regexpFlags,
      options.customOperators,
    ),
    defaultStringMatcher: getDefaultStringMatcher(value, regexpFlags),
    customObjectMatchers: getObjectMatchers(value, options.customOperators),
  };
}
