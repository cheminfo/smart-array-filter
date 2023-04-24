const operators: Record<string, (arg1: string[]) => (arg: number) => boolean> =
  {
    '<': function lt(values) {
      const value = Number(values[0]);
      return (number) => {
        return number < value;
      };
    },
    '<=': function lte(values) {
      const value = Number(values[0]);
      return (number) => {
        return number <= value;
      };
    },
    '=': function equal(values) {
      const possibleNumbers = values[0]
        .split(',')
        .filter((item: string) => item)
        .map(Number);
      return (number) => {
        for (let i = 0; i < possibleNumbers.length; i++) {
          if (number === possibleNumbers[i]) {
            return true;
          }
        }
        return false;
      };
    },
    '>=': function gte(values) {
      const value = Number(values[0]);
      return (number) => {
        return number >= value;
      };
    },
    '>': function gt(values) {
      const value = Number(values[0]);
      return (number) => {
        return number > value;
      };
    },
    '..': function range(values) {
      const valueLow = Number(values[0]);
      const valueHigh = Number(values[1]);
      return (number) => number >= valueLow && number <= valueHigh;
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
  values: string[];
  operator: string;
  /**
   * Is null when has the dot operator with a second value
   */
  secondQuery?: string;
} {
  const match =
    /^\s*\(?\s*(?<startOperator><=|>=|<|=|>|\.\.\s*)?\s*(?<firstValue>-?\d*\.?\d+)\s*(?:(?<afterDots>\.\.)\s*(?<secondValue>-?\d*\.?\d*))?\s*\)?\s*$/.exec(
      keyword,
    );
  if (!match) {
    return {
      operator: '=',
      values: [keyword],
    };
  }
  if (!match.groups) {
    throw new Error('unreachable');
  }
  const { startOperator, firstValue, afterDots, secondValue } = match.groups;
  let operator = startOperator;
  let values = firstValue ? [firstValue] : [];

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
    values.push(secondValue);
  }
  return {
    values,
    operator: operator || '=',
  };
}
