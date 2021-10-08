import escapeRegExp from 'lodash.escaperegexp';

import getCheckNumber from './getCheckNumber';
import getCheckString from './getCheckString';

export default function convertKeywordsToCriteria(keywords, options) {
  const { insensitive, pathAlias } = options;
  return keywords.map((keyword) => {
    let criterion = {
      is: false,
      key: false,
      negate: false,
      valueReg: undefined,
    };

    if (keyword.charAt(0) === '-') {
      criterion.negate = true;
      keyword = keyword.substring(1);
    }
    let colon = keyword.indexOf(':');
    if (colon > -1) {
      let value = keyword.substring(colon + 1);
      if (colon > 0) {
        let key = keyword.substring(0, colon);
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

function fillCriterion(criterion, keyword, insensitive) {
  criterion.checkString = getCheckString(keyword, insensitive);
  criterion.checkNumber = getCheckNumber(keyword);
}
