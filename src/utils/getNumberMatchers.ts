import type { CustomMatcher } from './customOperators.ts';

export type NumberOperator = (arg1: string[]) => (arg: number) => boolean;

const operators: Record<string, NumberOperator> = {
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
    const possibleNumbers = values[0].split(',').filter(Boolean).map(Number);
    return (number) => {
      for (const possibleNumber of possibleNumbers) {
        if (number === possibleNumber) {
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

export type NumberMatcher = (value: number, path: string[]) => boolean | null;
export type DefaultNumberMatcher = (value: number) => boolean;
/**
 * Builds the function which of a criterion which checks a leaf number value against the keyword.
 */
export default function getNumberMatchers(
  keyword: string,
  customOperators: CustomMatcher[],
): NumberMatcher[] {
  const matchers: NumberMatcher[] = [];
  for (const operator of customOperators) {
    const parseOutput = operator.parse(keyword);
    if (parseOutput !== null) {
      matchers.push(
        operator.createNumberMatcher
          ? operator.createNumberMatcher(parseOutput)
          : () => null,
      );
    }
  }
  return matchers;
}

export function getDefaultNumberMatcher(keyword: string) {
  const { values, operator } = splitNumberOperator(keyword);
  const checkOperator = operators[operator];
  /* v8 ignore start */
  if (!checkOperator) {
    throw new Error(`Unreachable. Unknown operator ${operator}`);
  }
  /* v8 ignore end */
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
  const values = firstValue ? [firstValue] : [];

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
    if (Number(secondValue) < Number(firstValue)) {
      values.unshift(secondValue);
    } else {
      values.push(secondValue);
    }
  }
  return {
    values,
    operator: operator || '=',
  };
}
