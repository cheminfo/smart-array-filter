import escapeRegExp from 'lodash.escaperegexp';

import charSplit from './charSplit.ts';
import type { CustomMatcher } from './customOperators.js';

export type StringOperator = (
  arg1: string[],
  arg2?: string,
) => (arg: string) => boolean;

const operators: Record<string, StringOperator> = {
  '<': function lt(query) {
    return (string) => {
      return string < query[0];
    };
  },
  '<=': function lte(query) {
    return (string) => {
      return string <= query[0];
    };
  },
  '=': function equal(query, insensitive) {
    const possibilities = charSplit(query[0], ',')
      .filter(Boolean)
      .map((string) => new RegExp(`^${escapeRegExp(string)}$`, insensitive));
    return (string) => {
      for (const possibility of possibilities) {
        if (possibility.test(string)) {
          return true;
        }
      }
      return false;
    };
  },
  '~': function fuzzy(query, insensitive) {
    const possibilities = charSplit(query[0], ',')
      .filter(Boolean)
      .map((string) => new RegExp(escapeRegExp(string), insensitive));
    return (string) => {
      for (const possibility of possibilities) {
        if (possibility.test(string)) {
          return true;
        }
      }
      return false;
    };
  },
  '>=': function lge(query) {
    return (string) => {
      return string >= query[0];
    };
  },
  '>': function lg(query) {
    return (string) => {
      return string > query[0];
    };
  },
  '..': function range(query) {
    return (string) => {
      return string >= query[0] && string <= query[1];
    };
  },
};

export type StringMatcher = (value: string, path: string[]) => boolean | null;
export type DefaultStringMatcher = (value: string) => boolean;

/**
 * Builds the function which of a criterion which checks a leaf string value against the keyword.
 */
export default function getStringMatchers(
  keyword: string,
  insensitive: string,
  customOperators: CustomMatcher[],
): StringMatcher[] {
  const matchers: StringMatcher[] = [];
  for (const operator of customOperators) {
    const parseOutput = operator.parse(keyword);
    if (parseOutput !== null) {
      matchers.push(
        operator.createStringMatcher
          ? operator.createStringMatcher(parseOutput)
          : () => null,
      );
    }
  }

  return matchers;
}

export function getDefaultStringMatcher(keyword: string, insensitive: string) {
  const { values, operator } = splitStringOperator(keyword);

  const operatorCheck = operators[operator];
  /* v8 ignore start */
  if (!operatorCheck) {
    throw new Error(`Unreachable. Unknown operator ${operator}`);
  }
  /* v8 ignore end */
  return operatorCheck(values, insensitive);
}

/**
 * @internal
 */
export function splitStringOperator(keyword: string): {
  operator: string;
  values: string[];
} {
  const parts = keyword.split('..');

  const match = /^\s*\(?(?<operator><=|<|=|>=|>)?\s*(?<value>\S*)\s*\)?$/.exec(
    parts[0],
  );
  if (!match) {
    return {
      operator: '~',
      values: [keyword],
    };
  }

  /* v8 ignore start */
  if (!match.groups) {
    throw new Error('Unreachable');
  }
  /* v8 ignore end */

  const { value } = match.groups;
  let { operator } = match.groups;
  const secondQuery: string | undefined = parts[1]?.trim();
  let values: string[] = [value];
  if (parts.length > 1) {
    operator = '..';
    if (!secondQuery) {
      operator = '>=';
    } else if (!value) {
      values = [secondQuery];
      operator = '<=';
    } else if (value < secondQuery) {
      values.push(secondQuery);
    } else {
      values.unshift(secondQuery);
    }
  }
  return {
    operator: operator || '~',
    values,
  };
}
