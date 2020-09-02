/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["assert","expect"] }] */

import { filter } from '..';

import chemicals from './chemicals.json';

describe('chemicals tests', () => {
  it('string matching', () => {
    assert('', 200);
    assert('brand:FisherSci', 29);
    assert('Cetrimonium', 3);
    assert('=Formaldehyde', 7);
  });

  it('numbers', () => {
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

function assert(keywords, length, options) {
  options = Object.assign({ keywords: keywords }, options);
  expect(filter(chemicals, options)).toHaveLength(length);
}
