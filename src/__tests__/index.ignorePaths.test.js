/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["assert","expect"] }] */

import { filter } from '..';

let test = [
  {
    h: [{ e: 1 }, { e: 2 }, { f: 3 }],
    i: ['jkl'],
  },
];

describe('ignorePaths', () => {
  it('string operators', () => {
    assert({ keywords: ['e:2'] }, 1);
    assert({ keywords: ['f:3'] }, 1);
    assert({ keywords: ['h.e:2'] }, 1);
    assert({ keywords: ['h.e:3'] }, 0);

    assert({ keywords: ['h.e:2'], ignorePaths: ['e'] }, 0);
    assert({ keywords: ['h.e:2'], ignorePaths: ['i'] }, 1);
    assert({ keywords: ['h.e:2'], ignorePaths: ['h'] }, 0);
    assert({ keywords: ['i:jkl'], ignorePaths: ['h'] }, 1);
    assert({ keywords: ['i:jkl'], ignorePaths: ['i'] }, 0);
  });
});

function assert(options, length) {
  expect(filter(test, options)).toHaveLength(length);
}
