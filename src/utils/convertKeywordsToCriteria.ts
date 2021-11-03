import escapeRegExp from 'lodash.escaperegexp';

import getCheckNumber from './getCheckNumber';
import getCheckString from './getCheckString';

interface Criterion{
    is: boolean|RegExp,
    key: boolean|RegExp,
    negate: boolean,
    valueReg: boolean|undefined,
    checkString?:boolean,
    checkNumber?:boolean
}
/**
 * ConvertKeywordsToCriteria.
 *
 * @param keywords - String.
 * @param options -Options.
 * @param options.insensitive - { [index:String] : boolean } }.
 * @param options.pathAlias - String.
 * @returns Criterion.
 */
export default function convertKeywordsToCriteria(keywords:string[], options:{ insensitive:string, pathAlias:{ [index:string] : boolean } }):Criterion[] {
  const { insensitive, pathAlias } = options;
  return keywords.map((keyword) => {
    let criterion:Criterion = {
      is: false,
      key: false,
      negate: false,
      valueReg: undefined,
    };

    if (keyword.startsWith('-')) {
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

/**
 * FillCriterion.
 *
 * @param criterion - Criterion.
 * @param keyword - String.
 * @param insensitive - String.
 */
function fillCriterion(criterion:Criterion, keyword:string, insensitive:string) {
  criterion.checkString = getCheckString(keyword, insensitive);
  criterion.checkNumber = getCheckNumber(keyword);
}