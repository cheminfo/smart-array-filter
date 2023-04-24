import { ValueCriterion } from '../utils/convertKeywordToCriterion';

/**
 * NativeMatch.
 *
 * @param element - String|number.
 * @param keyword - Criterion.
 * @returns Boolean.
 */
export default function nativeMatch(
  element: string | number | boolean | undefined,
  keyword: ValueCriterion,
): boolean {
  if (typeof element === 'string') {
    return keyword.checkString(element);
  } else if (typeof element === 'number') {
    return keyword.checkNumber(element);
  } else {
    return false;
  }
}
