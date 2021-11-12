import escapeRegExp from 'lodash.escaperegexp';

const operators: Record<
  string,
  (arg1: string, arg2?: string) => (arg: string) => boolean
> = {
  '<': (query) => {
    return (string) => {
      return string < query;
    };
  },
  '<=': (query) => {
    return (string) => {
      return string <= query;
    };
  },
  '=': (query, insensitive) => {
    query = `^${escapeRegExp(query)}$`;
    const reg = new RegExp(query, insensitive);

    return (string) => {
      return reg.test(string);
    };
  },
  '~': (query, insensitive) => {
    query = escapeRegExp(query);
    const reg = new RegExp(query, insensitive);

    return (string) => {
      return reg.test(string);
    };
  },
  '>=': (query) => {
    return (string) => {
      return string >= query;
    };
  },
  '>': (query) => {
    return (string) => {
      return string > query;
    };
  },
};

operators['..'] = operators['<='];

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
  const { query, secondQuery, operator } = splitStringOperator(keyword);
  let checkString: (arg: string) => boolean = () => false;

  if (operator) {
    checkString = operators[operator](query, insensitive);
  } else if (secondQuery) {
    if (secondQuery !== '') {
      checkString = (string) => {
        return query <= string && string <= secondQuery;
      };
    } else {
      checkString = operators['>='](query, insensitive);
    }
  } else {
    checkString = operators['~'](query, insensitive);
  }
  return checkString;
}

/**
 * @internal
 */
export function splitStringOperator(keyword: string): {
  operator?: string;
  query: string;
  secondQuery?: string;
} {
  const parts = keyword.split('..');

  const match = /^\s*\(?(?<operator><=|<|=|>=|>)?\s*(?<query>\S*)\s*\)?$/.exec(
    parts[0],
  );
  if (!match) {
    // Should never happen
    return {
      query: keyword,
    };
  }

  if (!match.groups) {
    throw new Error('unreachable');
  }

  const { operator, query } = match.groups;
  const secondQuery = parts[1];
  return {
    operator,
    query,
    secondQuery,
  };
}
