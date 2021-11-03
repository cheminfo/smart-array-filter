/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["assert","expect"] }] */

import { filter } from '..';

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
 * @param options
 * @param length
 */
function assert(options, length) {
  expect(filter(test, options)).toHaveLength(length);
}
