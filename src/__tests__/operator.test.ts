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

    expect(splitStringOperator('value1 ..value2')).toStrictEqual({
      values: ['value1', 'value2'],
      operator: '..',
    });

    expect(splitStringOperator('value1.. value2')).toStrictEqual({
      values: ['value1', 'value2'],
      operator: '..',
    });

    expect(splitStringOperator('value1 .. value2')).toStrictEqual({
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
      values: ['123.45'],
      operator: '=',
    });

    expect(splitNumberOperator('=123.45')).toStrictEqual({
      values: ['123.45'],
      operator: '=',
    });

    expect(splitNumberOperator('> 123.45')).toStrictEqual({
      values: ['123.45'],
      operator: '>',
    });

    expect(splitNumberOperator('<123.45')).toStrictEqual({
      values: ['123.45'],
      operator: '<',
    });

    expect(splitNumberOperator('<=123.45')).toStrictEqual({
      values: ['123.45'],
      operator: '<=',
    });

    expect(splitNumberOperator('>=123.45')).toStrictEqual({
      values: ['123.45'],
      operator: '>=',
    });

    expect(splitNumberOperator('123.45..123.56')).toStrictEqual({
      values: ['123.45', '123.56'],
      operator: '..',
    });

    expect(splitNumberOperator('123.45.. 123.56')).toStrictEqual({
      values: ['123.45', '123.56'],
      operator: '..',
    });

    expect(splitNumberOperator('123.45 ..123.56')).toStrictEqual({
      values: ['123.45', '123.56'],
      operator: '..',
    });

    expect(splitNumberOperator('123.45 .. 123.56')).toStrictEqual({
      values: ['123.45', '123.56'],
      operator: '..',
    });

    expect(splitNumberOperator('=1..2')).toStrictEqual({
      values: ['1', '2'],
      operator: '..',
    });

    expect(splitNumberOperator('2..3')).toStrictEqual({
      values: ['2', '3'],
      operator: '..',
    });

    expect(splitNumberOperator('..3')).toStrictEqual({
      values: ['3'],
      operator: '<=',
    });

    expect(splitNumberOperator('3..')).toStrictEqual({
      values: ['3'],
      operator: '>=',
    });

    expect(splitNumberOperator('xyz')).toStrictEqual({
      values: ['xyz'],
      operator: '=',
    });
  });
});
