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
});
