import { Criterion } from '../utils/convertKeywordToCriterion';
import { Json } from '../utils/types';

import nativeMatch from './nativeMatch';

/**
 * RecursiveMatch.
 *
 * @param element - String | number | Record<string, string>.
 * @param criterion - Criterion.
 * @param keys - String[].
 * @param options - Object.
 * @param options.ignorePaths - RegExp[].
 * @returns Boolean.
 */
export default function recursiveMatch(
  element: Json,
  criterion: Criterion,
  keys: string[],
  options: {
    ignorePaths: RegExp[];
    includePaths?: RegExp[];
  },
): boolean {
  if (typeof element === 'object') {
    if (Array.isArray(element)) {
      for (const elm of element) {
        if (recursiveMatch(elm, criterion, keys, options)) {
          return true;
        }
      }
    } else {
      for (const i in element) {
        keys.push(i);
        const didMatch = recursiveMatch(element[i], criterion, keys, options);
        keys.pop();
        if (didMatch) return true;
      }
    }
  } else if (criterion.type === 'exists') {
    // we check for the presence of a key (jpath)
    if (criterion.key.test(keys.join('.'))) {
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
    if (options.includePaths) {
      let included = false;
      for (const includePath of options.includePaths) {
        if (includePath.test(joinedKeys)) {
          included = true;
          break;
        }
      }
      if (!included) return false;
    }

    if (criterion.key) {
      if (!criterion.key.test(joinedKeys)) return false;
    }
    return nativeMatch(element, criterion);
  }
  return false;
}
