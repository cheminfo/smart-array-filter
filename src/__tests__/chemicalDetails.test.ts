import { filter } from '..';

import chemicals from './chemicalDetails.json';

describe('chemicalDetails tests', () => {
  it('string matching', () => {
    assert('', 4);
    assert('origsurediphenyle', 1);
  });

  it('numbers', () => {
    assert('price:<10', 4);
    assert('price:<1', 1);
    assert('price:1..2', 3);
    assert('price:>1000', 1);
    assert('pressure:760', 2);
    assert('exactMass:234..235', 1);
    assert('quantity:1g', 4);
  });

  it('decimal numbers', () => {
    assert('mw:132.16192', 1);
    assert('price:>200.5', 2);
    assert('mw:39.9..40.0', 1);
  });

  it('and', () => {
    assert('mw:132.16192 mw:132.16192', 1);
    assert('price:>200.5', 2);
    assert('mw:39.9..40.0 mw:38..42', 1);
    assert('price:>200.5 mw:>250', 1);
  });
});

/**
 * Assert.
 *
 * @param keywords - String.
 * @param length - Number.
 */
function assert(keywords: string, length: number) {
  expect(filter(chemicals, { keywords })).toHaveLength(length);
}
