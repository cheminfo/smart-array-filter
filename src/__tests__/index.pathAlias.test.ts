/* eslint-disable prefer-named-capture-group */

import { filter, OptionsType } from '..';

let data = [
  {
    h: [{ e: 1 }, { e: 2 }, { f: 3 }, { g: { a: 1, b: 2 } }],
    i: ['jkl'],
    k1: 1,
  },
  {
    k2: 2,
    h: {
      k1: 1,
    },
  },
];

test('pathAlias', () => {
  assert({ keywords: ['aliasK:>=1'], pathAlias: { aliasK: /^k.*/ } }, 2);
  assert({ keywords: ['aliasK:>=1'], pathAlias: { aliasK: 'h.k' } }, 0);

  assert({ keywords: ['aliasAbc:3'], pathAlias: { aliasAbc: 'h.f' } }, 1);
  assert({ keywords: ['aliasAbc:2'], pathAlias: { aliasAbc: 'h.f' } }, 0);
  assert({ keywords: ['aliasAbc:1'], pathAlias: { aliasAbc: /h\..*\.a/ } }, 1);
  assert(
    { keywords: ['aliasAbc:3'], pathAlias: { aliasAbc: /(h\.a|h\.e)/ } },
    0,
  );
  assert(
    { keywords: ['aliasAbc:3'], pathAlias: { aliasAbc: /(h\.a|h\.f)/ } },
    1,
  );
});

/**
 * Assert.
 *
 * @param options - Object.
 * @param options.keywords - String[].
 * @param options.pathAlias - Object.
 * @param options.pathAlias.aliasAbc - RegExp | string.
 * @param length - Number.
 */
function assert(options: OptionsType, length: number) {
  expect(filter(data, options)).toHaveLength(length);
}
