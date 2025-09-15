import { distance } from 'fastest-levenshtein';
import { describe, expect, test } from 'vitest';

import { filter } from '../index.ts';
import type { CustomOperator } from '../utils/customOperators.js';

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
    assertData('~5', [range], 1);
    assertData('~6', [range], 2);
  });
});

const range: CustomOperator<number> = {
  name: 'Range',
  parse: (input: string) => {
    const match = /^~(?<target>\d*\.?\d*)$/.exec(input);

    if (match?.groups?.target) {
      return Number(match.groups.target);
    }
    return null;
  },
  applyObject: (target) => (value) => {
    if (value === null) return false;
    if (typeof value?.value === 'number' && typeof value?.error === 'number') {
      const low = target - Math.abs(value.error);
      const high = target + Math.abs(value.error);
      return value.value >= low && value.value <= high;
    }
    return false;
  },
};

const levenshtein: CustomOperator<{ target: string; minScore: number }> = {
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
  applyString: (parsed) => (value: string) => {
    const dist = distance(parsed.target, value);
    const maxLen = Math.max(parsed.target.length, value.length);
    const score = ((maxLen - dist) / maxLen) * 100;
    return score > parsed.minScore;
  },
};

const plusMinus: CustomOperator<{ target: number; tolerance: number }> = {
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
  applyNumber: (parsed) => (value: number) => {
    return (
      value <= parsed.target + parsed.tolerance &&
      value >= parsed.target - parsed.tolerance
    );
  },
};

function assertChemicals(
  keywords: string,
  customOperators: CustomOperator[],
  length: number,
) {
  expect(filter(chemicals, { keywords, customOperators })).toHaveLength(length);
}

function assertData(
  keywords: string,
  customOperators: CustomOperator[],
  length: number,
) {
  expect(filter(data, { keywords, customOperators })).toHaveLength(length);
}
