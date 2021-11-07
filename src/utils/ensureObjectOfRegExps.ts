import escapeRegExp from 'lodash.escaperegexp';

/**
 * EnsureObjectOfRegExps.
 *
 * @param object  - { [index: string]: string|RegExp }.
 * @param options - Object.
 * @param options.insensitive - String.
 * @returns - Result.
 */
export default function ensureObjectOfRegExps(
  object: { [index: string]: string | RegExp },
  options: { insensitive: string },
) {
  const { insensitive } = options;
  const toReturn: { [index: string]: RegExp } = {};
  for (const [key, value] of Object.entries(object)) {
    if (value instanceof RegExp) {
      toReturn[key] = value;
    } else {
      toReturn[key] = new RegExp(
        `(^|\\.)${escapeRegExp(value)}(\\.|$)`,
        insensitive,
      );
    }
  }
  return toReturn;
}
