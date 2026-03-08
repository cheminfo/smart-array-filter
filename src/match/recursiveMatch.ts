import type { Criterion } from '../utils/convertKeywordToCriterion.ts';
import type { Json } from '../utils/types.ts';

import nativeMatch from './nativeMatch.ts';
import objectMatch from './objectMatch.ts';

interface PathOptions {
  /**
   * List of paths to ignore
   */
  ignorePaths: RegExp[];
  /**
   * List of paths to include. `ignorePaths` has precedence.
   */
  includePaths?: RegExp[];
}

/**
 * Recursively traverse an item to match it against a query criterion.
 */
export default function recursiveMatch(
  /**
   * The element to match the query with
   */
  element: Json,
  /**
   * A query criterion
   */
  criterion: Criterion,
  /**
   * The path of the passed element in the original data item
   */
  path: string[],
  /**
   * General options.
   */
  options: PathOptions,
): boolean {
  if (typeof element === 'object') {
    if (Array.isArray(element)) {
      for (const elm of element) {
        if (recursiveMatch(elm, criterion, path, options)) {
          return true;
        }
      }
    } else {
      if (
        criterion.type === 'matches' &&
        criterion.customObjectMatchers &&
        !shouldIgnorePath(criterion, path, options)
      ) {
        if (objectMatch(element, criterion.customObjectMatchers, path)) {
          return true;
        }
      }
      for (const i in element) {
        path.push(i);
        const didMatch = recursiveMatch(element[i], criterion, path, options);
        path.pop();
        if (didMatch) return true;
      }
    }
  } else if (criterion.type === 'exists') {
    // we check for the presence of a key (jpath)
    if (criterion.key.test(path.join('.'))) {
      return !!element;
    } else {
      return false;
    }
  } else {
    if (shouldIgnorePath(criterion, path, options)) {
      return false;
    }
    return nativeMatch(element, criterion, path);
  }
  return false;
}

function shouldIgnorePath(
  criterion: Criterion,
  keys: string[],
  options: PathOptions,
): boolean {
  const joinedKeys = keys.join('.');
  for (const ignorePath of options.ignorePaths) {
    if (ignorePath.test(joinedKeys)) return true;
  }
  if (options.includePaths) {
    let included = false;
    for (const includePath of options.includePaths) {
      if (includePath.test(joinedKeys)) {
        included = true;
        break;
      }
    }
    if (!included) return true;
  }
  return !!(criterion.key && !criterion.key.test(joinedKeys));
}
