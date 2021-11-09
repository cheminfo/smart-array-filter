import escapeRegExp from 'lodash.escaperegexp';

import { Criterion } from '..';

import getCheckNumber from './getCheckNumber';
import getCheckString from './getCheckString';

/**
 * @internal
 */
export default function convertKeywordsToCriteria(
  keywords: string[],
  options: {
    insensitive: string;
    pathAlias: Record<string, RegExp>;
  },
): Criterion[] {
  const { insensitive, pathAlias } = options;
  return keywords.map((keyword) => {
    const criterion = {} as Criterion;

    if (keyword.startsWith('-')) {
      criterion.negate = true;
      keyword = keyword.substring(1);
    }
    const colon = keyword.indexOf(':');
    if (colon > -1) {
      const value = keyword.substring(colon + 1);
      if (colon > 0) {
        const key = keyword.substring(0, colon);
        if (key === 'is') {
          // a property path exists
          criterion.is = new RegExp(
            `(^|\\.)${escapeRegExp(value)}(\\.|$)`,
            insensitive,
          );
        }
        if (pathAlias[key]) {
          criterion.key = pathAlias[key];
        } else {
          criterion.key = new RegExp(
            `(^|\\.)${escapeRegExp(key)}(\\.|$)`,
            insensitive,
          );
        }
      }
      fillCriterion(criterion, value, insensitive);
    } else {
      fillCriterion(criterion, keyword, insensitive);
    }

    return criterion;
  });
}

/**
 * FillCriterion.
 *
 * @param criterion - Criterion.
 * @param keyword - String.
 * @param insensitive - String.
 */
function fillCriterion(
  criterion: Criterion,
  keyword: string,
  insensitive: string,
) {
  criterion.checkString = getCheckString(keyword, insensitive);
  criterion.checkNumber = getCheckNumber(keyword);
}
