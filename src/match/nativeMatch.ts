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
    for (const matcher of criterion.customStringMatchers) {
      const match = matcher(element, path);
      if (match !== null) {
        return match;
      }
    }
    return criterion.defaultStringMatcher(element);
  } else if (typeof element === 'number') {
    for (const matcher of criterion.customNumberMatchers) {
      const match = matcher(element, path);
      if (match !== null) {
        return match;
      }
    }
    return criterion.defaultNumberMatcher(element);
  } else {
    // Booleans never match
    return false;
  }
}
