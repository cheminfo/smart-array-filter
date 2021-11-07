/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrayType, Criterion } from '..';

import nativeMatch from './nativeMatch';

/**
 * RecursiveMatch.
 *
 * @param element - ArrayType.
 * @param criterium - Criterion.
 * @param keys - String[].
 * @param options - Object.
 * @param options.ignorePaths - RegExp[].
 * @param options.pathAlias - { [s: string]: RegExp }.
 * @returns Boolean.
 */
export default function recursiveMatch(
  element: ArrayType | string | number | any,
  criterium: Criterion,
  keys: string[],
  options: {
    ignorePaths: RegExp[];
    pathAlias: { [s: string]: RegExp | string };
  },
): boolean {
  if (typeof element === 'object') {
    if (Array.isArray(element)) {
      for (const elm of element) {
        if (recursiveMatch(elm, criterium, keys, options)) {
          return true;
        }
      }
    } else {
      for (let i in element) {
        keys.push(i);
        let didMatch = recursiveMatch(element[i], criterium, keys, options);
        keys.pop();
        if (didMatch) return true;
      }
    }
  } else if (criterium.is) {
    // we check for the presence of a key (jpath)
    if ((criterium.is as RegExp).test(keys.join('.'))) {
      return !!element;
    } else {
      return false;
    }
  } else {
    // need to check if keys match
    const joinedKeys = keys.join('.');
    for (let ignorePath of options.ignorePaths) {
      if (ignorePath.test(joinedKeys)) return false;
    }
    if (criterium.key) {
      const key = options.pathAlias[criterium.key as string]
        ? (options.pathAlias[criterium.key as string] as RegExp)
        : (criterium.key as RegExp);
      if (!key.test(joinedKeys)) return false;
    }
    return nativeMatch(element, criterium);
  }
  return false;
}
