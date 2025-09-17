import type { CustomMatcher } from './customOperators.js';
import type { JSONObject } from './types.js';

export type CustomObjectMatcher = (
  arg: JSONObject | null,
  path: string[],
) => boolean | null;

export default function getObjectMatchers(
  keyword: string,
  customOperators: CustomMatcher[],
): CustomObjectMatcher[] {
  const matchers: CustomObjectMatcher[] = [];
  for (const customOperator of customOperators) {
    if (customOperator.createObjectMatcher) {
      const parsedValues = customOperator.parse(keyword);
      if (parsedValues !== null) {
        matchers.push(customOperator.createObjectMatcher(parsedValues));
      }
    }
  }
  return matchers;
}
