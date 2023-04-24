import assert from 'assert';

import { convertKeywordToCriterion } from '../convertKeywordToCriterion';

it('value keyword with field', () => {
  const criterium = convertKeywordToCriterion('a:a');
  expect(criterium.type).toBe('matches');
  assert(criterium.type === 'matches');
  expect(criterium.key).toBeInstanceOf(RegExp);
  expect(criterium.negate).toBe(false);
  expect(criterium.checkNumber).toBeDefined();
  expect(criterium.checkString).toBeDefined();
});

it('value keyword with operator', () => {
  const criterium = convertKeywordToCriterion('abc:>10');
  expect(criterium.type).toBe('matches');
  assert(criterium.type === 'matches');
  expect(criterium.key).toBeInstanceOf(RegExp);
  expect(criterium.negate).toBe(false);
  expect(criterium.checkNumber).toBeDefined();
  expect(criterium.checkString).toBeDefined();
  expect(criterium.checkNumber(12)).toBe(true);
  expect(criterium.checkNumber(8)).toBe(false);
});

it('key keyword with the "is:" syntax', () => {
  const criterium = convertKeywordToCriterion('is:abc');
  expect(criterium.type).toBe('exists');
  assert(criterium.type === 'exists');
  expect(criterium.key).toBeInstanceOf(RegExp);
  expect(criterium.negate).toBe(false);
});
