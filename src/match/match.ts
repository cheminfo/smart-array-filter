import type { Predicate } from '../index';
import type { Criterion } from '../utils/convertKeywordToCriterion';
import type { Json } from '../utils/types';

import recursiveMatch from './recursiveMatch';

/**
 * Match.
 * @param element - String | number | Record<string, string>.
 * @param criteria - Criterion[].
 * @param predicate - String.
 * @param options - Object.
 * @param options.ignorePaths - RegExp[].
 * @param options.pathAlias - Record<string, string|RegExp>s.
 * @param options.includePaths
 * @returns Boolean.
 */
export default function match(
  element: Json,
  criteria: Criterion[],
  predicate: Predicate,
  options: {
    ignorePaths: RegExp[];
    includePaths?: RegExp[];
    pathAlias: Record<string, RegExp>;
  },
): boolean {
  if (criteria.length > 0) {
    let found = false;
    for (const criterion of criteria) {
      // match XOR negate
      if (
        recursiveMatch(element, criterion, [], options)
          ? !criterion.negate
          : criterion.negate
      ) {
        if (predicate === 'OR') {
          return true;
        }
        found = true;
      } else if (predicate === 'AND') {
        return false;
      }
    }
    return found;
  }
  return true;
}
