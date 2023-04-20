# Changelog

### [4.0.1](https://www.github.com/cheminfo/smart-array-filter/compare/v4.0.0...v4.0.1) (2023-04-20)


### Miscellaneous Chores

* improve type of predicate option ([23b668a](https://www.github.com/cheminfo/smart-array-filter/commit/23b668ac25e736e2a43eacd07d602e46bb64d884))

## [4.0.0](https://www.github.com/cheminfo/smart-array-filter/compare/v3.2.0...v4.0.0) (2022-08-16)


### ⚠ BREAKING CHANGES

* allow a 'or' operator with comma separated values

### Features

* allow a 'or' operator with comma separated values ([2798d82](https://www.github.com/cheminfo/smart-array-filter/commit/2798d82f38170c034e2c65b5abe805587c054790))

## [3.2.0](https://www.github.com/cheminfo/smart-array-filter/compare/v3.1.3...v3.2.0) (2022-07-15)


### Features

* add includePaths property ([42a4e7c](https://www.github.com/cheminfo/smart-array-filter/commit/42a4e7cb1993ae6e17b63ca05c8497131f7ab3a1))
* allow comma separated values (as OR operator) ([8652f11](https://www.github.com/cheminfo/smart-array-filter/commit/8652f11d752ca2ddb79d71cab893df3f40aaba6e))

### [3.1.3](https://www.github.com/cheminfo/smart-array-filter/compare/v3.1.2...v3.1.3) (2021-11-12)


### Bug Fixes

* add number operator parsing test when not a number ([07c3351](https://www.github.com/cheminfo/smart-array-filter/commit/07c335170403c1ef62a808f0628b5497935d4fc6))

### [3.1.2](https://www.github.com/cheminfo/smart-array-filter/compare/v3.1.1...v3.1.2) (2021-11-10)


### Bug Fixes

* make data input type less types less restrictive ([e0ee2ea](https://www.github.com/cheminfo/smart-array-filter/commit/e0ee2eaf1c057190c1ca0520f2533d1946e69efd))

### [3.1.1](https://www.github.com/cheminfo/smart-array-filter/compare/v3.1.0...v3.1.1) (2021-11-09)


### Bug Fixes

* removed unused filter option "sensitive" ([02259da](https://www.github.com/cheminfo/smart-array-filter/commit/02259daf6ccea93a3401397778c427a4ccbe5804))

## [3.1.0](https://www.github.com/cheminfo/smart-array-filter/compare/v3.0.0...v3.1.0) (2021-11-09)


### Features

* when alias is string, make sure it matches the full property ([3ed166b](https://www.github.com/cheminfo/smart-array-filter/commit/3ed166bb4ce5dfd1ef1c0f1dc4815b937e4f46c2))


### Bug Fixes

* use negative lookahead to avoid wrongly identifying the query operator ([c78eef4](https://www.github.com/cheminfo/smart-array-filter/commit/c78eef4653ce328186f343c10c98eb292f7a5eff))

## [3.0.0](https://www.github.com/cheminfo/smart-array-filter/compare/v2.3.0...v3.0.0) (2021-11-09)


### ⚠ BREAKING CHANGES

* migrate to typescript

### Features

* allow ignorePaths to be a regexp ([9fb2890](https://www.github.com/cheminfo/smart-array-filter/commit/9fb289000c8ca245b5c95d2081edc087c3a3940a))
* migrate to typescript ([7cdcfac](https://www.github.com/cheminfo/smart-array-filter/commit/7cdcfacefa814828a79ecb2480d6b61bf1ec3f7e))

## [2.3.0](https://www.github.com/cheminfo/smart-array-filter/compare/v2.2.0...v2.3.0) (2021-10-14)


### Features

* add CJS build ([8f582e5](https://www.github.com/cheminfo/smart-array-filter/commit/8f582e5cfdd13c1b46e0c6ab69ce4f19408cbc85))
* publish lib in npm ([cf3f269](https://www.github.com/cheminfo/smart-array-filter/commit/cf3f269f1f5d5dd056aceeb6990262113d3557b2))

## [2.2.0](https://www.github.com/cheminfo/smart-array-filter/compare/v2.1.0...v2.2.0) (2021-10-08)


### Features

* add pathAlias ([6703d27](https://www.github.com/cheminfo/smart-array-filter/commit/6703d2787906ec2013ea46722074af11274573a7))


### Bug Fixes

* add missing prettier script ([5a33fc5](https://www.github.com/cheminfo/smart-array-filter/commit/5a33fc5b2e179aa3289902a14942f725fe816e92))
* remove dist folder because it is not maintained ([a802161](https://www.github.com/cheminfo/smart-array-filter/commit/a8021610b49b19bb158c4b11e6873ddc8a615bd2))

## [2.1.0](https://github.com/cheminfo/smart-array-filter/compare/v2.0.3...v2.1.0) (2021-10-07)


### Features

* add ignorePaths option ([ba2eac4](https://github.com/cheminfo/smart-array-filter/commit/ba2eac4e7947b191e0f24c1dd767a69602e3f5f5))

1.1.0 / 2016-08-26
==================

* add limit option

1.0.0 / 2016-08-18
==================

* make number parser more strict

0.5.0 / 2016-04-14
==================

* add index option to the filter function. If set to true, an array of indexes is returned instead of objects.

0.4.1 / 2016-03-11
==================

* add a few tests for numbers

0.4.0 / 2016-02-15
==================

* add support for decimal numbers
* escape input string before creating RegExps

0.3.0 / 2015-11-16
==================

* add support for exact word with =word
* add support for quoted keywords

0.2.0 / 2015-11-06
==================

* add support for "is" operator
* compare numbers strictly
* add support for number comparators

0.1.0 / 2015-11-05
==================

* add support for negation
* add support for property name matching

0.0.2 / 2015-11-04
==================

* add support for case-insensitivity

0.0.1 / 2015-11-03
==================

* first release
