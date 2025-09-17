import { extractAll } from 'check-cas-number';
import { MF } from 'mf-parser';
import { expect, test } from 'vitest';

import { filter } from '../index.js';
import type { CustomMatcher } from '../utils/customOperators.js';

import chemicals from './chemicals.json' with { type: 'json' };

test('searching for MF in mf path', () => {
  const mf = '"Et CH O3"';
  const results = filter(chemicals, {
    customMatchers: [handleMF],
    keywords: mf,
  });
  expect(results).toHaveLength(4);
});

test('searching for MF that could be anywhere', () => {
  const mf = 'EtCHO3';
  const results = filter(chemicals, {
    customMatchers: [handleMFAnywhere],
    keywords: mf,
  });
  expect(results).toHaveLength(4);
});

test('could be MF or CAS anywhere', () => {
  const query = 'EtCHO3 "[50-14-6],50-24-8"';
  const results = filter(chemicals, {
    customMatchers: [handleMFAnywhere, handleCASAnywhere],
    keywords: query,
    predicate: 'OR',
  });
  expect(results).toHaveLength(6);
});

const handleMF: CustomMatcher<string> = {
  name: 'Check canonic MF in mf path',
  parse: (input) => {
    try {
      return new MF(input).toMF();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null;
    }
  },
  createStringMatcher: (target) => (value, path) => {
    if (path.at(-1) === 'mf') {
      try {
        return new MF(value).toMF() === target;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // do nothing the MF is not valid
      }
    }
    // Ignores this operator and runs the next ones
    return null;
  },
};

const handleMFAnywhere: CustomMatcher<string> = {
  name: 'Check canonic MF anywhere',
  parse: (input) => new MF(input).toMF(),
  createStringMatcher: (target) => (value) => {
    try {
      // if we return false the other operators will not be used !!!!
      if (new MF(value).toMF() === target) {
        return true;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // do nothing the MF is not valid
    }
    // Ignores this operator and runs the next ones
    return null;
  },
};

const handleCASAnywhere: CustomMatcher<string[]> = {
  name: 'Check CAS number anywhere',
  parse: (input) => {
    const allCAS = extractAll(input);
    return allCAS.length > 0 ? allCAS : null;
  },
  createStringMatcher: (targets) => (value) => {
    const casNumbers = extractAll(value);
    for (const target of targets) {
      if (casNumbers.includes(target)) {
        return true;
      }
    }
    // Ignores this operator and runs the next ones
    return null;
  },
};
