import { filter, OptionsType } from '..';

let data = [
  {
    h: [{ e: 1 }, { e: 2 }, { f: 3 }],
    i: ['jkl'],
    j: { e: 2 },
  },
];

test('includePaths', () => {
  assert({ keywords: ['h.e:2'], includePaths: ['e'] }, 1);
  assert({ keywords: ['h.e:2'], includePaths: ['h.e'] }, 1);
  assert({ keywords: ['h.e:2'], includePaths: ['i.e'] }, 0);
  assert({ keywords: ['h.e:2'], includePaths: ['h.f', 'h.e'] }, 1);
  assert({ keywords: ['h.e:2'], includePaths: ['i'] }, 0);
  assert({ keywords: ['h.e:2'], includePaths: ['h'] }, 1);
  assert({ keywords: ['i:jkl'], includePaths: ['h'] }, 0);
  assert({ keywords: ['i:jkl'], includePaths: ['i'] }, 1);
  assert({ keywords: ['h.f:3'], includePaths: [/h.*/] }, 1);
  assert({ keywords: ['h.f:3'], includePaths: [/h.*f/] }, 1);
  assert({ keywords: ['h.f:3'], includePaths: [/e.*g/] }, 0);
});

/**
 * Assert.
 *
 * @param options - Object.
 * @param options.keywords - RegExp[].
 * @param options.includePaths - RegExp[].
 * @param length - Number.
 */
function assert(options: OptionsType, length: number) {
  expect(filter(data, options)).toHaveLength(length);
}
