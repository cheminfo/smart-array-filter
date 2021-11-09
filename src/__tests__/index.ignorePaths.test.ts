import { filter, OptionsType } from '..';

let data = [
  {
    h: [{ e: 1 }, { e: 2 }, { f: 3 }],
    i: ['jkl'],
  },
];

test('ignorePaths', () => {
  assert({ keywords: ['e:2'] }, 1);
  assert({ keywords: ['f:3'] }, 1);
  assert({ keywords: ['h.e:2'] }, 1);
  assert({ keywords: ['h.e:3'] }, 0);

  assert({ keywords: ['h.e:2'], ignorePaths: ['e'] }, 0);
  assert({ keywords: ['h.e:2'], ignorePaths: ['h.e'] }, 0);
  assert({ keywords: ['h.e:2'], ignorePaths: ['i.e'] }, 1);
  assert({ keywords: ['h.e:2'], ignorePaths: ['h.f'] }, 1);
  assert({ keywords: ['h.e:2'], ignorePaths: ['i'] }, 1);
  assert({ keywords: ['h.e:2'], ignorePaths: ['h'] }, 0);
  assert({ keywords: ['i:jkl'], ignorePaths: ['h'] }, 1);
  assert({ keywords: ['i:jkl'], ignorePaths: ['i'] }, 0);
  assert({ keywords: ['h.f:3'], ignorePaths: [/e.*/] }, 1);
  assert({ keywords: ['h.f:3'], ignorePaths: [/h.*f/] }, 0);
  assert({ keywords: ['h.f:3'], ignorePaths: [/e.*g/] }, 1);
});

/**
 * Assert.
 *
 * @param options - Object.
 * @param options.keywords - RegExp[].
 * @param options.ignorePaths - RegExp[].
 * @param length - Number.
 */
function assert(options: OptionsType, length: number) {
  expect(filter(data, options)).toHaveLength(length);
}
