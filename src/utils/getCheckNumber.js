const operators = {
  '<': (query) => {
    return (number) => {
      return number < query;
    };
  },
  '<=': (query) => {
    return (number) => {
      return number <= query;
    };
  },
  '=': (query) => {
    return (number) => {
      return number === query;
    };
  },
  '>=': (query) => {
    return (number) => {
      return number >= query;
    };
  },
  '>': (query) => {
    return (number) => {
      return number > query;
    };
  },
};

// we also deal with ..10 and 10..
operators['..'] = operators['<='];

/**
 * @param keyword
 */
export default function getCheckNumber(keyword) {
  let match =
    /^\s*\(?\s*(<|<=|=|>=|>|\.\.)?(-?\d*\.?\d+)(?:(\.\.)(-?\d*\.?\d*))?\s*\)?\s*$/.exec(
      keyword,
    );
  let checkNumber = () => false;
  if (match) {
    let operator = match[1];
    let query = parseFloat(match[2]);
    let dots = match[3];
    let secondQuery = match[4];
    if (operator) {
      checkNumber = operators[operator](query);
    } else if (dots) {
      if (secondQuery !== '') {
        secondQuery = parseFloat(secondQuery);
        checkNumber = (number) => {
          return query <= number && number <= secondQuery;
        };
      } else {
        checkNumber = operators['>='](query);
      }
    } else {
      checkNumber = operators['='](query);
    }
  }
  return checkNumber;
}
