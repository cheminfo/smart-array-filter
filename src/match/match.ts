import { ArrayType, Criterion } from '../index';

import recursiveMatch from './recursiveMatch';

/**
 * Match.
 *
 * @param element - ArrayType|String|number.
 * @param criteria - Criterion[].
 * @param predicate - String.
 * @param options - Object.
 * @param options.ignorePaths - RegExp[].
 * @param options.pathAlias - { [s: string]: RegExp|string }.
 * @returns Boolean.
 */
export default function match(
  element: ArrayType | string | number,
  criteria: Criterion[],
  predicate: string,
  options: {
    ignorePaths: RegExp[];
    pathAlias: { [s: string]: RegExp | string };
  },
) {
  if (criteria.length) {
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
