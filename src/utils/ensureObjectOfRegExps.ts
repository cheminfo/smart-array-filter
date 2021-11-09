import escapeRegExp from 'lodash.escaperegexp';

/**
 * EnsureObjectOfRegExps.
 *
 * @param object  - { [index: string]: string|RegExp }.
 * @param options - Object.
 * @param options.insensitive - String.
 * @returns - Record<string, string|RegExp>.
 */
export default function ensureObjectOfRegExps(
  object: Record<string, RegExp | string>,
  options: { insensitive: string },
): Record<string, RegExp> {
  const { insensitive } = options;
  const toReturn: Record<string, RegExp> = {};

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
