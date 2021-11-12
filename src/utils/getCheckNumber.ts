const operators: Record<string, (arg1: number[]) => (arg: number) => boolean> =
  {
    '<': function lt(values) {
      return (number) => {
        return number < values[0];
      };
    },
    '<=': function lte(values) {
      return (number) => {
        return number <= values[0];
      };
    },
    '=': function equal(values) {
      return (number) => {
        return number === values[0];
      };
    },
    '>=': function gte(values) {
      return (number) => {
        return number >= values[0];
      };
    },
    '>': function gt(values) {
      return (number) => {
        return number > values[0];
      };
    },
    '..': function range(values) {
      return (number) => number >= values[0] && number <= values[1];
    },
  };

/**
 * @internal
 */
export default function getCheckNumber(
  keyword: string,
): (arg: number) => boolean {
  const { values, operator } = splitNumberOperator(keyword);

  const checkOperator = operators[operator];
  if (!checkOperator) {
    throw new Error(`unknown operator ${operator}`);
  }
  return checkOperator(values);
}

/**
 * @internal
 */
export function splitNumberOperator(keyword: string): {
  values: number[];
  operator: string;
  /**
   * Is null when has the dot operator with a second value
   */
  secondQuery?: number;
} {
  const match =
    /^\s*\(?\s*(?<startOperator><|<=|=|>=|>|\.\.)?(?<firstValue>-?\d*\.?\d+)(?:(?<afterDots>\.\.)(?<secondValue>-?\d*\.?\d*))?\s*\)?\s*$/.exec(
      keyword,
    );
  if (!match) {
    return {
      operator: '=',
      values: [Number(keyword)],
    };
  }
  if (!match.groups) {
    throw new Error('unreachable');
  }
  const { startOperator, firstValue, afterDots, secondValue } = match.groups;
  let operator = startOperator;
  let values = firstValue ? [Number(firstValue)] : [];

  // ..12
  if (startOperator === '..') {
    operator = '<=';
  }
  // 12..
  else if (!startOperator && afterDots && !secondValue) {
    operator = '>=';
  }
  // 12..14
  else if (afterDots) {
    operator = '..';
  }

  if (secondValue) {
    values.push(Number(secondValue));
  }
  return {
    values,
    operator: operator || '=',
  };
}
