import escapeRegExp from 'lodash.escaperegexp';

const operators = {
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
 * @param keyword
 * @param insensitive
 */
export default function getCheckString(keyword, insensitive) {
  let parts = keyword.split('..');
  let match = /^\s*\(?\s*(<|<=|=|>=|>)?(\S*)\s*\)?$/.exec(parts[0]);
  let checkString = () => false;
  if (match) {
    let operator = match[1];
    let query = match[2];
    let dots = parts.length > 1 ? '..' : '';
    let secondQuery = parts[1];
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
