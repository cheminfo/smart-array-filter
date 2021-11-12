import { splitNumberOperator } from '../utils/getCheckNumber';
import { splitStringOperator } from '../utils/getCheckString';

describe('operators', () => {
  it('string operators', () => {
    expect(splitStringOperator('value')).toStrictEqual({
      values: ['value'],
      operator: '~',
    });

    expect(splitStringOperator('=value')).toStrictEqual({
      values: ['value'],
      operator: '=',
    });

    expect(splitStringOperator('> value')).toStrictEqual({
      values: ['value'],
      operator: '>',
    });

    expect(splitStringOperator('<value')).toStrictEqual({
      values: ['value'],
      operator: '<',
    });

    expect(splitStringOperator('<=value')).toStrictEqual({
      values: ['value'],
      operator: '<=',
    });

    expect(splitStringOperator('>= value')).toStrictEqual({
      values: ['value'],
      operator: '>=',
    });

    expect(splitStringOperator('value1..value2')).toStrictEqual({
      values: ['value1', 'value2'],
      operator: '..',
    });

    expect(splitStringOperator('value1..')).toStrictEqual({
      values: ['value1'],
      operator: '>=',
    });

    expect(splitStringOperator('..value2')).toStrictEqual({
      values: ['value2'],
      operator: '<=',
    });

    expect(splitStringOperator('  ')).toStrictEqual({
      values: [''],
      operator: '~',
    });
  });

  it('number operators', () => {
    expect(splitNumberOperator('123.45')).toStrictEqual({
      query: 123.45,
      operator: undefined,
      secondQuery: undefined,
    });

    expect(splitNumberOperator('=123.45')).toStrictEqual({
      query: 123.45,
      operator: '=',
      secondQuery: undefined,
    });

    expect(splitNumberOperator('>123.45')).toStrictEqual({
      query: 123.45,
      operator: '>',
      secondQuery: undefined,
    });

    expect(splitNumberOperator('<123.45')).toStrictEqual({
      query: 123.45,
      operator: '<',
      secondQuery: undefined,
    });

    expect(splitNumberOperator('<=123.45')).toStrictEqual({
      query: 123.45,
      operator: '<=',
      secondQuery: undefined,
    });

    expect(splitNumberOperator('>=123.45')).toStrictEqual({
      query: 123.45,
      operator: '>=',
      secondQuery: undefined,
    });

    expect(splitNumberOperator('123.45..123.56')).toStrictEqual({
      query: 123.45,
      operator: '..',
      secondQuery: 123.56,
    });

    expect(splitNumberOperator('=1..2')).toStrictEqual({
      query: 1,
      operator: '..',
      secondQuery: 2,
    });

    expect(splitNumberOperator('2..3')).toStrictEqual({
      query: 2,
      operator: '..',
      secondQuery: 3,
    });

    expect(splitNumberOperator('..3')).toStrictEqual({
      query: 3,
      operator: '<=',
      secondQuery: undefined,
    });

    expect(splitNumberOperator('3..')).toStrictEqual({
      query: 3,
      operator: '>=',
      secondQuery: undefined,
    });
  });
});
