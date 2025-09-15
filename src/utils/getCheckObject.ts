import type {
  CustomObjectOperator,
  CustomOperator,
} from './customOperators.js';
import type { JSONObject } from './types.js';

export default function getCheckObject(
  keyword: string,
  customOperators: CustomOperator[],
): (arg: JSONObject | null) => boolean {
  const operator = splitObjectOperator(keyword, customOperators);
  if (!operator) {
    // None of the custom operators can parse the keyword
    return () => false;
  }

  return operator.operator.applyObject(operator.values);
}
export function splitObjectOperator(
  keyword: string,
  customOperators: CustomOperator[],
): { operator: CustomObjectOperator; values: unknown } | null {
  for (const customOperator of customOperators) {
    if (!customOperator.applyObject) {
      continue;
    }
    const parsedValues = customOperator.parse(keyword);
    if (parsedValues !== null) {
      return {
        operator: customOperator as CustomObjectOperator,
        values: parsedValues,
      };
    }
  }
  return null;
}
