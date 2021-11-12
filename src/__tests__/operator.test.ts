import { splitNumberOperator } from '../utils/getCheckNumber';
import { splitStringOperator } from '../utils/getCheckString';

describe('operators', () => {
  it('string operators', () => {
    expect(splitStringOperator('value')).toStrictEqual({
      query: 'value',
      operator: undefined,
      secondQuery: undefined,
    });

    expect(splitStringOperator('=value')).toStrictEqual({
      query: 'value',
      operator: '=',
      secondQuery: undefined,
    });

    expect(splitStringOperator('> value')).toStrictEqual({
      query: 'value',
      operator: '>',
      secondQuery: undefined,
    });

    expect(splitStringOperator('<value')).toStrictEqual({
      query: 'value',
      operator: '<',
      secondQuery: undefined,
    });

    expect(splitStringOperator('<=value')).toStrictEqual({
      query: 'value',
      operator: '<=',
      secondQuery: undefined,
    });

    expect(splitStringOperator('>= value')).toStrictEqual({
      query: 'value',
      operator: '>=',
      secondQuery: undefined,
    });

    expect(splitStringOperator('value1..value2')).toStrictEqual({
      query: 'value1',
      operator: undefined,
      secondQuery: 'value2',
    });

    expect(splitStringOperator('=value1..value2')).toStrictEqual({
      query: 'value1',
      operator: '=',
      secondQuery: 'value2',
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
