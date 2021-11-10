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
  },
  {
    str: 'abc',
    arr: ['1', '2'],
    bool: false,
    num: 0,
  },
];

describe('is', () => {
  it('positive is', () => {
    // check if some fields are truthy
    assert({ keywords: ['is:obj1.obj2'] }, 1);
    assert({ keywords: ['is:bool'] }, 2);
    assert({ keywords: ['is:nested'] }, 1);
    assert({ keywords: ['is:str'] }, 1);
    // TODO: determine how this test should behave
    // assert({ keywords: ['is:arr'] }, 1);
    assert({ keywords: ['is:num'] }, 1);
    assert({ keywords: ['is:arr'] }, 2);
  });
  it('negated is', () => {
    // check if some fields are falsy
    assert({ keywords: ['-is:bool'] }, 1);
    assert({ keywords: ['-is:str'] }, 2);
    assert({ keywords: ['-is:num'] }, 2);
    // TODO: determine how this test should behave
    // assert({ keywords: ['-is:arr'] }, 1);
  });
});

/**
 * @internal
 */
function assert(options: OptionsType | undefined, length: number) {
  expect(filter(test, options)).toHaveLength(length);
}
