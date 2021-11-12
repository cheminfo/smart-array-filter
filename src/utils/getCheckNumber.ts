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
 * @internal
 */
export default function getCheckNumber(
  keyword: string,
): (arg: number) => boolean {
  const { query, secondQuery, operator } = splitNumberOperator(keyword);

  let checkNumber: (arg: number) => boolean = () => false;

  if (operator && operator !== '..') {
    checkNumber = operators[operator](query);
  } else if (operator && secondQuery) {
    checkNumber = (number) => {
      return query <= number && number <= secondQuery;
    };
  } else {
    checkNumber = operators['='](query);
  }

  return checkNumber;
}

/**
 * @internal
 */
export function splitNumberOperator(keyword: string): {
  query: number;
  operator?: string;
  /**
   * Is null when has the dot operator with a second value
   */
  secondQuery?: number | null;
} {
  const match =
    /^\s*\(?\s*(?<startOperator><|<=|=|>=|>|\.\.)?(?<firstValue>-?\d*\.?\d+)(?:(?<afterDots>\.\.)(?<secondValue>-?\d*\.?\d*))?\s*\)?\s*$/.exec(
      keyword,
    );
  if (!match) {
    return {
      query: Number(keyword),
    };
  }
  if (!match.groups) {
    throw new Error('unreachable');
  }
  const { startOperator, firstValue, afterDots, secondValue } = match.groups;
  let operator = startOperator;

  // ..12
  if (startOperator === '..') {
    operator = '<=';
  }

  // 12..
  if (!startOperator && afterDots && !secondValue) {
    operator = '>=';
  }
  // 12..14
  else if (afterDots) {
    operator = '..';
  }
  return {
    query: Number(firstValue),
    operator,
    secondQuery: secondValue ? Number(secondValue) : undefined,
  };
}
