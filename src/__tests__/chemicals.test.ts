/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["assert","expect"] }] */

import { filter, OptionsType } from '..';

import chemicals from './chemicals.json';

describe('chemicals tests', () => {
  it('string matching', () => {
    assert('', 200);
    assert('brand:FisherSci', 29);
    assert('Cetrimonium', 3);
    assert('=Cetrimonium', 0);
    assert('=Formaldehyde', 7);
  });

  it('string comparison', () => {
    assert('brand:>FisherSci', 9);
    assert('brand:>=FisherSci', 38);
  });

  it('numbers', () => {
    assert('mp:-15', 5);
    assert('mp:=230', 3);
    assert('price1:<0', 0);
    assert('price1:<0', 0, { limit: 100 });
    assert('price1:<50', 85);
    assert('price1:<50', 50, { limit: 50 });
    assert('price1:<50', 85, { limit: 100 });
    assert('price1:>=50', 99);
    assert('mp:230..230', 3);
    assert('mw:30..31', 7);
    assert('idontexist:', 0);
  });
});

/**
 * Assert.
 *
 * @param keywords - String.
 * @param length - Number.
 * @param options - Object.
 * @param options.limit - Number.
 */
function assert(keywords: string, length: number, options?: OptionsType) {
  options = Object.assign({ keywords: keywords }, options);
  expect(filter(chemicals, options)).toHaveLength(length);
}