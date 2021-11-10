import { filter, OptionsType } from '..';

let test = [
  {
    a: 'a',
    str: '',
    arr: [0, 1],
    bool: true,
    num: 1,
  },
  {
    obj1: {
      obj2: {
        nested: 'nested',
      },
      bool: true,
    },
    // is criterion is not tested on array itself
    arr: [],
  },
  {
    str: 'abc',
    bool: false,
    num: 0,
    arr: [0],
  },
];

describe('is', () => {
  it('positive is', () => {
    // check if some fields are truthy
    assert({ keywords: ['is:obj1.obj2'] }, [1]);
    assert({ keywords: ['is:bool'] }, [0, 1]);
    assert({ keywords: ['is:nested'] }, [1]);
    assert({ keywords: ['is:str'] }, [2]);
    assert({ keywords: ['is:num'] }, [0]);
    assert({ keywords: ['is:arr'] }, [0]);
  });
  it('negated is', () => {
    // check if some fields are falsy
    assert({ keywords: ['-is:bool'] }, [2]);
    assert({ keywords: ['-is:str'] }, [0, 1]);
    assert({ keywords: ['-is:num'] }, [1, 2]);
    assert({ keywords: ['-is:arr'] }, [1, 2]);
  });
});

/**
 * @internal
 */
function assert(options: OptionsType | undefined, matches: number[]) {
  expect(filter(test, { ...options, index: true })).toStrictEqual(matches);
}
