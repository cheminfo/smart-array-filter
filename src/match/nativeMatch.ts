import type { ValueCriterion } from '../utils/convertKeywordToCriterion.ts';

/**
 * Matcher for leaf native values of the queried object.
 */
export default function nativeMatch(
  element: string | number | boolean | undefined,
  criterion: ValueCriterion,
  path: string[],
): boolean {
  if (typeof element === 'string') {
    for (const matcher of criterion.stringMatchers) {
      const match = matcher(element, path);
      if (match === null) {
        continue;
      }
      return match;
    }
  } else if (typeof element === 'number') {
    for (const matcher of criterion.numberMatchers) {
      const match = matcher(element, path);
      if (match === null) {
        continue;
      }
      return match;
    }
  } else {
    // Booleans never match
    return false;
  }
  /* v8 ignore start */
  // Unreachable. The last matcher is the default one which should never return null.
  return false;
  /* v8 ignore end */
}
