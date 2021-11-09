import { filter, OptionsType } from '..';

let test = [
  {
    a: 'a',
    d: {
      e: 123,
    },
  },
  {
    a: 'b',
    d: {
      e: 234,
    },
  },
];

describe('simple filter', () => {
  it('math operators', () => {
    assert({ keywords: ['e:>125'] }, 1);
    assert({ keywords: ['f:>125'] }, 0);
    assert({ keywords: ['a:>a'] }, 1);
    assert({ keywords: ['e:>23'] }, 2);
  });
});

/**
 * Assert.
 *
 * @param options - OptionsType.
 * @param length - Number.
 */
function assert(options: OptionsType, length: number) {
  expect(filter(test, options)).toHaveLength(length);
}
