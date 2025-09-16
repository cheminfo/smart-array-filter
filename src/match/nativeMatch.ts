import type { ValueCriterion } from '../utils/convertKeywordToCriterion.ts';

/**
 * NativeMatch.
 * @param element - String|number.
 * @param keyword - Criterion.
 * @returns Boolean.
 */
export default function nativeMatch(
  element: string | number | boolean | undefined,
  keyword: ValueCriterion,
  path: string[],
): boolean {
  if (typeof element === 'string') {
    return keyword.checkString(element, path);
  } else if (typeof element === 'number') {
    return keyword.checkNumber(element, path);
  } else {
    return false;
  }
}
