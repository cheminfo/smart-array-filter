import { filter, OptionsType } from '..';

let test = [
  {
    h: [{ e: 1 }, { e: 2 }, { f: 3 }],
    i: ['jkl'],
  },
];

describe('simple2 filter', () => {
  it('string operators', () => {
    assert({ keywords: '>4' }, 1); // will actually math jkl, letters are after number in ascii code
    assert({ keywords: 'e:>2' }, 0);
    assert({ keywords: 'e:>=2' }, 1);
    assert({ keywords: 'f:>=3' }, 1);
    assert({ keywords: 'a.e:>2' }, 0);
    assert({ keywords: 'h.e:>2' }, 0);
    assert({ keywords: 'h.e:>=2' }, 1);
  });

  it('not possible to include array index in key', () => {
    assert({ keywords: 'h:>0' }, 1);
    assert({ keywords: 'h.0:>0' }, 0);
    assert({ keywords: 'h.e:>0' }, 1);
    assert({ keywords: 'h.0.e:>0' }, 0);
    assert({ keywords: 'is:h.0' }, 0);
  });
});

/**
 * Assert.
 *
 * @param options - Object.
 * @param options.keywords - String.
 * @param length - Number.
 */
function assert(options: OptionsType, length: number) {
  expect(filter(test, options)).toHaveLength(length);
}
