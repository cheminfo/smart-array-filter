import type { CustomMatcher } from './customOperators.js';
import type { JSONObject } from './types.js';

export type ObjectMatcher = (
  arg: JSONObject | null,
  path: string[],
) => boolean | null;

export default function getObjectMatchers(
  keyword: string,
  customOperators: CustomMatcher[],
): ObjectMatcher[] {
  const matchers: ObjectMatcher[] = [];
  for (const customOperator of customOperators) {
    const parsedValues = customOperator.parse(keyword);
    if (parsedValues !== null) {
      matchers.push(
        customOperator.createObjectMatcher
          ? customOperator.createObjectMatcher(parsedValues)
          : () => null, // Unreachable, getObjectMatchers is never called if no object matcher exists
      );
    }
  }
  return matchers;
}
