import { distance } from 'fastest-levenshtein';
import escapeRegExp from 'lodash.escaperegexp';
import { describe, expect, test } from 'vitest';

import { filter } from '../index.ts';
import type { CustomMatcher } from '../utils/customOperators.js';

import chemicals from './chemicals.json' with { type: 'json' };

const data = [
  {
    prop1: {
      nested1: {
        value: 10,
        error: 4,
      },
    },
  },
  {
    prop2: 10,
    prop3: {
      value: 3,
      error: 5,
      other: 'other',
    },
  },
  {
    prop1: {
      value: 7,
      tolerance: 2,
    },
  },
];

describe('Custom operators', () => {
  test('+- operator on numbers', () => {
    assertChemicals('mw:335+-5', [plusMinus], 5);
    assertChemicals('422630030+-20', [plusMinus], 1);
  });
  test('Levenshtein operator on strings', () => {
    // Matches L-Cystine with a levenshtein score of more than 65%
    assertChemicals('Cystie~65', [levenshtein], 4);
  });

  test('Range operator on objects', () => {
    const range = getRangeOperator('value', 'error');
    // All
    assertData('~5', [range], 1);
    assertData('~6', [range], 2);
    // Negation
    assertData('-~5', [range], 2);
    assertData('-~6', [range], 1);
    // Scoped
    assertData('prop1.nested1:~5', [range], 0);
    assertData('prop1.nested1:~6', [range], 1);
    // Regular keywords should still work even with the custom operator enabled
    assertData('ther', [range], 1);
  });

  test('Combine number and string handlers', () => {
    assertChemicals('1255.4 C62', [handleMw, handleMf], 2);
    assertChemicals('1255.4 C62', [handleMf, handleMw], 2);
    assertChemicals('1255.4', [handleMw, handleMf], 2);
    assertChemicals('1255.4', [handleMf, handleMw], 2);
    assertChemicals('C62', [handleMw, handleMf], 2);
    assertChemicals('C62', [handleMf, handleMw], 2);
    assertChemicals('1255.4 C63', [handleMw, handleMf], 0);
    assertChemicals('1255.5 C62', [handleMw, handleMf], 0);
  });

  test('Combine multiple number handlers', () => {
    assertChemicals('142.2 330.1', [handleMw, handleBp], 1);
    assertChemicals('142.2 330.1', [handleBp, handleMw], 1);
  });

  test('Combine multiple range operators', () => {
    const range1 = getRangeOperator('value', 'error');
    const range2 = getRangeOperator('value', 'tolerance');
    // All
    assertData('~6', [range1, range2], 3);
    assertData('~5', [range1, range2], 2);
  });
});

const handleMw: CustomMatcher<number> = {
  name: 'Handle MW',
  parse: (input) => {
    if (/^\d*\.?\d*$/.test(input)) {
      return Number(input);
    }
    return null;
  },
  createNumberMatcher: (target) => (value, path) => {
    if (path.at(-1) === 'mw') {
      return value - 0.05 <= target && value + 0.05 >= target;
    }
    // Ignores this operator and runs the next ones
    return null;
  },
};

const handleBp: CustomMatcher<number> = {
  name: 'Handle melting point',
  parse: (input) => {
    if (/^\d*\.?\d*$/.test(input)) {
      return Number(input);
    }
    return null;
  },
  createNumberMatcher: (target) => (value, path) => {
    if (path.at(-1) === 'mp') {
      return value - 0.5 <= target && value + 0.5 >= target;
    }
    // Ignores this operator and runs the next ones
    return null;
  },
};

const handleMf: CustomMatcher<string> = {
  name: 'Catch MF with regular expression',
  parse: (input) => escapeRegExp(input),
  createStringMatcher: (target) => (value, path) => {
    if (path.at(-1) === 'mf') {
      return new RegExp(target).test(value);
    }
    // Ignores this operator and runs the next ones
    return null;
  },
};

function getRangeOperator(
  valueProp: string,
  toleranceProp: string,
): CustomMatcher<number> {
  return {
    name: 'Range',
    parse: (input: string) => {
      const match = /^~(?<target>\d*\.?\d*)$/.exec(input);

      if (match?.groups?.target) {
        return Number(match.groups.target);
      }
      return null;
    },
    createObjectMatcher: (target) => (obj) => {
      if (obj === null) return false;
      const value = obj?.[valueProp];
      const tolerance = obj?.[toleranceProp];
      if (typeof value === 'number' && typeof tolerance === 'number') {
        const low = target - Math.abs(tolerance);
        const high = target + Math.abs(tolerance);
        return value >= low && value <= high;
      }
      return null;
    },
  };
}

// Testing that multiple instances of the same operator work correctly

const levenshtein: CustomMatcher<{ target: string; minScore: number }> = {
  name: 'Levenshtein',
  parse: (input: string) => {
    const match = /^(?<target>.+)~(?<minScore>\d*\.?\d*)$/.exec(input);

    if (match?.groups?.target && match.groups?.minScore) {
      return {
        target: match.groups.target,
        minScore: Number(match.groups.minScore),
      };
    }
    return null;
  },
  createStringMatcher: (parsed) => (value) => {
    const dist = distance(parsed.target, value);
    const maxLen = Math.max(parsed.target.length, value.length);
    const score = ((maxLen - dist) / maxLen) * 100;
    return score > parsed.minScore;
  },
};

const plusMinus: CustomMatcher<{ target: number; tolerance: number }> = {
  name: 'Plus/Minus',
  parse: (input: string) => {
    const match = /^(?<target>\d*\.?\d*)\+-(?<tolerance>\d*\.?\d*)$/.exec(
      input,
    );

    if (match?.groups?.target && match.groups?.tolerance) {
      return {
        target: Number(match.groups.target),
        tolerance: Math.abs(Number(match.groups.tolerance)),
      };
    }
    return null;
  },

  // We don't want the regular string matching to apply when this operator is detected
  createStringMatcher: () => () => false,
  createNumberMatcher: (parsed) => (value: number) => {
    return (
      value <= parsed.target + parsed.tolerance &&
      value >= parsed.target - parsed.tolerance
    );
  },
};

function assertChemicals(
  keywords: string,
  customOperators: CustomMatcher[],
  length: number,
) {
  expect(
    filter(chemicals, { keywords, customMatchers: customOperators }),
  ).toHaveLength(length);
}

function assertData(
  keywords: string,
  customOperators: CustomMatcher[],
  length: number,
) {
  expect(
    filter(data, { keywords, customMatchers: customOperators }),
  ).toHaveLength(length);
}
