/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["assert","expect"] }] */

import { filter } from '..';

let data = [
  {
    h: [{ e: 1 }, { e: 2 }, { f: 3 }, { g: { a: 1, b: 2 } }],
    i: ['jkl'],
  },
];

test('pathAlias', () => {
  assert({ keywords: ['abc:3'], pathAlias: { abc: 'h.f' } }, 1);
  assert({ keywords: ['abc:2'], pathAlias: { abc: 'h.f' } }, 0);
  assert({ keywords: ['abc:1'], pathAlias: { abc: /h\..*\.a/ } }, 1);
  assert({ keywords: ['abc:3'], pathAlias: { abc: /(h\.a|h\.e)/ } }, 0);
  assert({ keywords: ['abc:3'], pathAlias: { abc: /(h\.a|h\.f)/ } }, 1);
});

/**
 * @param options
 * @param length
 */
function assert(options, length) {
  expect(filter(data, options)).toHaveLength(length);
}
