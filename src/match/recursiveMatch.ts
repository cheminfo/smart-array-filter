import { Criterion, Json } from '..';

import nativeMatch from './nativeMatch';

/**
 * RecursiveMatch.
 *
 * @param element - String | number | Record<string, string>.
 * @param criterium - Criterion.
 * @param keys - String[].
 * @param options - Object.
 * @param options.ignorePaths - RegExp[].
 * @returns Boolean.
 */
export default function recursiveMatch(
  element: Json,
  criterium: Criterion,
  keys: string[],
  options: {
    ignorePaths: RegExp[];
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
      for (const i in element) {
        keys.push(i);
        const didMatch = recursiveMatch(element[i], criterium, keys, options);
        keys.pop();
        if (didMatch) return true;
      }
    }
  } else if (criterium.is) {
    // we check for the presence of a key (jpath)
    if (criterium.is.test(keys.join('.'))) {
      return !!element;
    } else {
      return false;
    }
  } else {
    // need to check if keys match
    const joinedKeys = keys.join('.');
    for (const ignorePath of options.ignorePaths) {
      if (ignorePath.test(joinedKeys)) return false;
    }
    if (criterium.key) {
      if (!criterium.key.test(joinedKeys)) return false;
    }
    return nativeMatch(element, criterium);
  }
  return false;
}
