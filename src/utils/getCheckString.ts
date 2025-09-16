import escapeRegExp from 'lodash.escaperegexp';

import charSplit from './charSplit.ts';
import type { CustomOperator } from './customOperators.js';

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

/**
 * Builds the function which of a criterion which checks a leaf string value against the keyword.
 */
export default function getCheckString(
  keyword: string,
  insensitive: string,
  customOperators: CustomOperator[],
): (arg: string, path: string[]) => boolean {
  for (const operator of customOperators) {
    const parseOutput = operator.parse(keyword);
    if (parseOutput !== null) {
      return operator.createStringMatcher
        ? operator.createStringMatcher(parseOutput)
        : () => false;
    }
  }
  const { values, operator } = splitStringOperator(keyword);

  const operatorCheck = operators[operator];
  if (!operatorCheck) {
    throw new Error(`unreachable unknown operator ${operator}`);
  }
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
    // Should never happen
    return {
      operator: '~',
      values: [keyword],
    };
  }

  if (!match.groups) {
    throw new Error('unreachable');
  }

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
