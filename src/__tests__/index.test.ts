import { filter, OptionsType } from '..';

let test = [
  {
    a: 'a',
    b: 'b',
    c: ['pppcpp', 'D'],
    d: {
      e: 123,
      f: {
        g: ['h'],
      },
    },
    neg: -3.5,
    spec: '[]',
    bool: true,
  },
  {
    h: 'h',
    i: ['jkl'],
    m: {
      n: {
        O: 'OoO',
      },
      bool: true,
    },
  },
];

describe('index.test', () => {
  it('no keywords: filter nothing', () => {
    assert(undefined, 2);
    assert({ keywords: null }, 2);
    assert({ keywords: null, limit: 1 }, 1);
    assert({ keywords: null, limit: 0 }, 2);
  });

  it('1 keyword, OR', () => {
    assert({ keywords: ['a'], predicate: 'OR' }, 1);
    assert({ keywords: ['C'], predicate: 'OR' }, 1);
    assert({ keywords: ['d'], predicate: 'OR' }, 1);
    assert({ keywords: ['oo'], predicate: 'OR' }, 1);
    assert({ keywords: ['123'], predicate: 'OR' }, 1);
    assert({ keywords: ['h'], predicate: 'OR' }, 2);
    assert({ keywords: ['z'], predicate: 'OR' }, 0);
  });

  it('1 keyword, AND', () => {
    assert({ keywords: ['a'] }, 1);
    assert({ keywords: ['a'], predicate: 'AND' }, 1);
    assert({ keywords: ['c'], predicate: 'AND' }, 1);
    assert({ keywords: ['d'], predicate: 'AND' }, 1);
    assert({ keywords: ['123'], predicate: 'AND' }, 1);
    assert({ keywords: ['123,234'], predicate: 'AND' }, 1);
    assert({ keywords: ['h'], predicate: 'AND' }, 2);
    assert({ keywords: ['z'], predicate: 'AND' }, 0);
  });

  it('2 keywords, OR', () => {
    assert({ keywords: ['a', 'b'], predicate: 'OR' }, 1);
    assert({ keywords: ['c', '123'], predicate: 'OR' }, 1);
    assert({ keywords: ['d', 'x'], predicate: 'OR' }, 1);
    assert({ keywords: ['x', '123'], predicate: 'OR' }, 1);
    assert({ keywords: ['x', 'y'], predicate: 'OR' }, 0);
  });

  it('2 keywords, AND', () => {
    assert({ keywords: ['a', 'b'] }, 1);
    assert({ keywords: ['a', 'b'], predicate: 'AND' }, 1);
    assert({ keywords: ['c', '123'], predicate: 'AND' }, 1);
    assert({ keywords: ['d', 'x'], predicate: 'AND' }, 0);
    assert({ keywords: ['x', '123'], predicate: 'AND' }, 0);
    assert({ keywords: ['x', 'y'], predicate: 'AND' }, 0);
  });

  it('case sensitive', () => {
    assert({ keywords: ['kl', 'oO'], caseSensitive: true }, 1);
    assert({ keywords: ['kl', 'oo'], caseSensitive: true }, 0);
  });

  it('exclusion', () => {
    assert({ keywords: ['-a'] }, 1);
    assert({ keywords: ['-h'] }, 0);
    assert({ keywords: ['-oo'] }, 1);
    assert({ keywords: ['-xzfe'] }, 2);
  });

  it('with property name', () => {
    assert({ keywords: ['a:a'] }, 1);
    assert({ keywords: ['A:a'], caseSensitive: true }, 0);
    assert({ keywords: ['a:A'] }, 1);
    assert({ keywords: ['a:b'] }, 0);
    assert({ keywords: ['e:123'] }, 1);
    assert({ keywords: ['e:12,23,123'] }, 1);
    assert({ keywords: ['e:12,23,34'] }, 0);
  });

  it('exact word', () => {
    assert({ keywords: 'oo' }, 1);
    assert({ keywords: '=oo' }, 0);
    assert({ keywords: 'a:=a' }, 1);
    assert({ keywords: 'a:=b' }, 0);
    assert({ keywords: '=b' }, 1);
  });

  it('complex', () => {
    assert({ keywords: 'a:a -x:aoe e:123  -o:bae   ' }, 1);
    assert({ keywords: ['a:a', '-x:aoe', 'e:123', '-o:bae'] }, 1);
  });

  it('array of primitives', () => {
    assert({ keywords: ['pcp'] }, 1);
    assert({ keywords: ['c:D'] }, 1);
    expect(filter([1, 2, 3], { keywords: ['1'] })).toStrictEqual([1]);
    expect(filter([1, 2, 3], { keywords: ['>1'] })).toStrictEqual([2, 3]);
    expect(filter(['test', 'Hello'], { keywords: ['es'] })).toStrictEqual([
      'test',
    ]);
    expect(filter(['test', 'Hello'], { keywords: ['hell'] })).toStrictEqual([
      'Hello',
    ]);
    expect(
      filter(['test', 'Hello'], {
        keywords: ['hell'],
        caseSensitive: true,
      }),
    ).toStrictEqual([]);
  });

  it('equality operator', () => {
    assert({ keywords: ['e:123'] }, 1);
    assert({ keywords: ['e:125'] }, 0);
    assert({ keywords: ['e:=123'] }, 1);
    assert({ keywords: ['e:=125'] }, 0);
  });
  it('gt,lt,gte,lte operators', () => {
    assert({ keywords: ['e:>125'] }, 0);
    assert({ keywords: ['e:<123'] }, 0);
    assert({ keywords: ['e:<200'] }, 1);
    assert({ keywords: ['e:<100'] }, 0);

    assert({ keywords: ['e:<=123'] }, 1);
    assert({ keywords: ['e:<=200'] }, 1);
    assert({ keywords: ['e:<=100'] }, 0);

    assert({ keywords: ['e:>123'] }, 0);
    assert({ keywords: ['e:>120'] }, 1);

    assert({ keywords: ['e:>=123'] }, 1);
    assert({ keywords: ['e:>=120'] }, 1);
    assert({ keywords: ['e:>=125'] }, 0);
  });

  it('math dot operator with end only', () => {
    assert({ keywords: ['e:..100'] }, 0);
    assert({ keywords: ['e:..123'] }, 1);
    assert({ keywords: ['e:..200'] }, 1);
  });

  it('math dot operator with start only', () => {
    assert({ keywords: ['e:200..'] }, 0);
    assert({ keywords: ['e:123..'] }, 1);
    assert({ keywords: ['e:100..'] }, 1);
  });

  it('math dot operator with start and end', () => {
    assert({ keywords: ['e:100..150'] }, 1);
    assert({ keywords: ['e:100.2..150.2'] }, 1);
    assert({ keywords: ['e:150..200'] }, 0);
    assert({ keywords: ['e:10..20'] }, 0);
    assert({ keywords: ['e:20..10'] }, 0);
    assert({ keywords: ['e:150..100'] }, 0);
  });

  it('special characters', () => {
    assert({ keywords: ['[]'] }, 1);
    assert({ keywords: ['.'] }, 0);
  });

  it('numbers', () => {
    assert({ keywords: ['-3.5'] }, 2); // meaning an entry where 3.5 is not there !
    assert({ keywords: ['-neg:-3.5'] }, 1); // meaning an entry where 3.5 is not there !
    assert({ keywords: ['<-3'] }, 1); // meaning an entry where 3.5 is not there !
    assert({ keywords: ['<-3.5'] }, 0); // meaning an entry where 3.5 is not there !
    assert({ keywords: ['(-3.5)'] }, 1);
    assert({ keywords: ['4'] }, 0);
    assert({ keywords: ['54.6'] }, 0);
    assert({ keywords: ['(-54.6)'] }, 0);
  });

  it('index', () => {
    let result = filter(test, { keywords: ['a:a'], index: true });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(0);

    result = filter(test, { keywords: ['is:bool'], index: true });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(1);
  });

  it('strict number parser', () => {
    assert({ keywords: ['123'] }, 1);
    assert({ keywords: ['a123'] }, 0);
    assert({ keywords: ['a123b'] }, 0);
    assert({ keywords: ['123b'] }, 0);
  });
});

/**
 * Assert.
 *
 * @param options - OptionsType.
 * @param length - Number.
 */
function assert(options: OptionsType | undefined, length: number) {
  expect(filter(test, options)).toHaveLength(length);
}
