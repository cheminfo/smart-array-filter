const operators: Record<string, (arg1: number) => (arg: number) => boolean> = {
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
 * GetCheckNumber.
 *
 * @param keyword - String.
 * @returns (number)=>boolean.
 */
export default function getCheckNumber(
  keyword: string,
): (arg: number) => boolean {
  const match =
    // eslint-disable-next-line prefer-named-capture-group
    /^\s*\(?\s*(<|<=|=|>=|>|\.\.)?(-?\d*\.?\d+)(?:(\.\.)(-?\d*\.?\d*))?\s*\)?\s*$/.exec(
      keyword,
    );
  let checkNumber: (arg: number) => boolean = () => false;
  if (match) {
    const operator = match[1];
    const query = parseFloat(match[2]);
    const dots = match[3];
    let secondQuery: string | number = match[4];
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
