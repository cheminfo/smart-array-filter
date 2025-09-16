import type {
  CustomObjectOperator,
  CustomOperator,
} from './customOperators.js';
import type { JSONObject } from './types.js';

export default function getCheckObject(
  keyword: string,
  customOperators: CustomOperator[],
): (arg: JSONObject | null, path: string[]) => boolean {
  for (const customOperator of customOperators) {
    const parsedValues = customOperator.parse(keyword);
    if (parsedValues !== null) {
      return customOperator.createObjectMatcher
        ? customOperator.createObjectMatcher(parsedValues)
        : () => false;
    }
  }
  return () => false;
}
export function splitObjectOperator(
  keyword: string,
  customOperators: CustomOperator[],
): { operator: CustomObjectOperator; values: unknown } | null {
  for (const customOperator of customOperators) {
    if (!customOperator.createObjectMatcher) {
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
