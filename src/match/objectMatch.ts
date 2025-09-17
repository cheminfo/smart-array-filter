import type { CustomObjectMatcher } from '../utils/getObjectMatchers.js';
import type { JSONObject } from '../utils/types.js';

/**
 * Matcher for leaf native values of the queried object.
 */
export default function objectMatch(
  element: JSONObject | null,
  customObjectMatchers: CustomObjectMatcher[],
  path: string[],
): boolean {
  for (const matcher of customObjectMatchers) {
    const match = matcher(element, path);
    if (match !== null) {
      return match;
    }
  }
  return false;
}
