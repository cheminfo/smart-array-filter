import escapeRegExp from 'lodash.escaperegexp';

export default function ensureObjectOfRegExps(object, options) {
  const { insensitive } = options;
  const toReturn = {};
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
