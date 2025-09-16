import type { ValueCriterion } from '../utils/convertKeywordToCriterion.ts';
import type { JSONObject } from '../utils/types.js';

/**
 * Matcher for leaf native values of the queried object.
 */
export default function objectMatch(
  element: JSONObject | null,
  criterion: ValueCriterion,
  path: string[],
): boolean {
  const matchers = criterion.objectMatchers || [];

  for (const matcher of matchers) {
    const match = matcher(element, path);
    if (match === null) {
      continue;
    }
    return match;
  }
  return false;
}
