import assert from 'node:assert';

import { expect, test } from 'vitest';

import { convertKeywordToCriterion } from './convertKeywordToCriterion.ts';

test('value keyword with field', () => {
  const criterium = convertKeywordToCriterion('a:a');
  expect(criterium.type).toBe('matches');
  assert(criterium.type === 'matches');
  expect(criterium.key).toBeInstanceOf(RegExp);
  expect(criterium.negate).toBe(false);
  expect(criterium.numberMatchers).toHaveLength(1);
  expect(criterium.stringMatchers).toHaveLength(1);
  expect(criterium.objectMatchers).not.toBeDefined();
});

test('value keyword with operator', () => {
  const criterium = convertKeywordToCriterion('abc:>10');
  expect(criterium.type).toBe('matches');
  assert(criterium.type === 'matches');
  expect(criterium.key).toBeInstanceOf(RegExp);
  expect(criterium.negate).toBe(false);
  expect(criterium.numberMatchers).toHaveLength(1);
  expect(criterium.stringMatchers).toHaveLength(1);
  expect(criterium.numberMatchers[0](12, [])).toBe(true);
  expect(criterium.numberMatchers[0](8, [])).toBe(false);
});

test('key keyword with the "is:" syntax', () => {
  const criterium = convertKeywordToCriterion('is:abc');
  expect(criterium.type).toBe('exists');
  assert(criterium.type === 'exists');
  expect(criterium.key).toBeInstanceOf(RegExp);
  expect(criterium.negate).toBe(false);
});
