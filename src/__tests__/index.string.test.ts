import { filter, OptionsType } from '..';

let test = [
  {
    h: 'h',
    f: 130,
    i: ['jkl'],
  },
];

describe('string filter', () => {
  it('string range', () => {
    assert({ keywords: ['i:j..k'] }, 1);
    assert({ keywords: ['i:a..b'] }, 0);
  });

  it('string equals', () => {
    assert({ keywords: ['i:jk'] }, 1);
    assert({ keywords: ['i:=jk'] }, 0);

    assert({ keywords: ['h'] }, 1);
    assert({ keywords: ['k'] }, 1);
    assert({ keywords: ['=k'] }, 0);
    assert({ keywords: ['=jkl'] }, 1);
  });

  it('string lt,gt,lte,gte', () => {
    assert({ keywords: ['i:>=jk'] }, 1);
    assert({ keywords: ['i:>=jkl'] }, 1);
    assert({ keywords: ['i:<=jkl'] }, 1);
    assert({ keywords: ['i:<=jkla'] }, 1);
    assert({ keywords: ['i:<jkl'] }, 0);
    assert({ keywords: ['i:>jkl'] }, 0);
    assert({ keywords: ['>k'] }, 0);
    assert({ keywords: ['h:>i'] }, 0);
    assert({ keywords: ['h:>g'] }, 1);
  });

  it('comma separated', () => {
    assert({ keywords: ['h:=a,h,b'] }, 1);
    assert({ keywords: ['a,h,b'] }, 1);
  });
});

/**
 * Assert.
 *
 * @param options - OptionsType.
 * @param options.keywords - String[].
 * @param length - Number.
 */
function assert(options: OptionsType, length: number) {
  expect(filter(test, options)).toHaveLength(length);
}
