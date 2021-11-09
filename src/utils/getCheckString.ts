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
  const parts = keyword.split('..');
  // eslint-disable-next-line prefer-named-capture-group
  const match = /^\s*\(?\s*(<=|<|=|>=|>)?(\S*)\s*\)?$/.exec(parts[0]);
  let checkString: (arg: string) => boolean = () => false;
  if (match) {
    const operator = match[1];
    const query = match[2];
    const dots = parts.length > 1 ? '..' : '';
    const secondQuery = parts[1];
    if (operator) {
      checkString = operators[operator](query, insensitive);
    } else if (dots) {
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
  }
  return checkString;
}
