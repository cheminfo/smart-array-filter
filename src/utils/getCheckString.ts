import escapeRegExp from 'lodash.escaperegexp';

import charSplit from './charSplit';

const operators: Record<
  string,
  (arg1: string[], arg2?: string) => (arg: string) => boolean
> = {
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
      .filter((item) => item)
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
      .filter((item) => item)
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
 * GetCheckString.
 *
 * @param keyword - String.
 * @param insensitive - String.
 * @returns CheckString. (string)=>boolean.
 */
export default function getCheckString(
  keyword: string,
  insensitive: string,
): (arg: string) => boolean {
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

  let { operator, value } = match.groups;
  let secondQuery: string | undefined = parts[1]?.trim();
  let values: string[] = [value];
  if (parts.length > 1) {
    operator = '..';
    if (!secondQuery) {
      operator = '>=';
    } else if (!value) {
      values = [secondQuery];
      operator = '<=';
    } else {
      values.push(secondQuery);
    }
  }
  return {
    operator: operator || '~',
    values,
  };
}
