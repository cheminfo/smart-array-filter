/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["assert","expect"] }] */

import { filter } from '..';

let test = [
  {
    h: 'h',
    f: 130,
    i: ['jkl'],
  },
];

describe('string filter', () => {
  it('string operators', () => {
    assert({ keywords: ['i:j..k'] }, 1);
    assert({ keywords: ['i:a..b'] }, 0);

    assert({ keywords: ['i:jk'] }, 1);
    assert({ keywords: ['i:=jk'] }, 0);
    assert({ keywords: ['h'] }, 1);
    assert({ keywords: ['k'] }, 1);
    assert({ keywords: ['=k'] }, 0);
    assert({ keywords: ['=jkl'] }, 1);
    assert({ keywords: ['>k'] }, 0);
    assert({ keywords: ['h:>i'] }, 0);
    assert({ keywords: ['h:>g'] }, 1);
  });
});

/**
 * @param options
 * @param length
 */
function assert(options, length) {
  expect(filter(test, options)).toHaveLength(length);
}
