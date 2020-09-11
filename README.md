# smart-array-filter

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![npm download][download-image]][download-url]

Filter an array of objects

## Installation

`npm install smart-array-filter`

## Documentation

### Example

```js
const array = [
  { id: 'A', pet: 'dog' },
  { id: 'B', pet: 'cat' },
];
const filteredData = filter(array, {
  limit: 1,
  keywords: 'Do', // search for any field that contains the "Do" string
  caseSensitive: true,
});
```

```js
var array = [
  { id: '1', pet: 'dog' },
  { id: '2', pet: 'cat' },
  { id: '3', pet: 'horse' },
];
filter(array, {
  keyword: '-pet:cat', // not a cat
});

filter(array, {
  keyword: '2', // any field has the value 2
});

filter(array, {
  keyword: '>2', // any field has the value after 2. Strings will be included and letters are after numbers in ascii code
});

filter(array, {
  keyword: 'id:>=2', // id greater or equal to 2
});

filter(array, {
  keyword: 'id:1..2', // id between 1 and 2 (including 1 and 2)
});
```

If you enter many criteria by default there is a 'AND' combination

```js
var array = [{ animals: ['dog', 'cat'] }, { animals: ['horse', 'cat'] }];
filter(array, {
  keyword: 'animals:cat', // array must contain a cat
});
filter(array, {
  keyword: 'animals:o', // by default it is include so match dog and horse
});
filter(array, {
  keyword: 'animals:=o', // must contain exactly a 'o'
});
```

```js
var array = [{ a: [{ b: 1 }, { c: 2 }] }, { a: [{ b: 2 }, { d: 2 }] }];
filter(array, {
  keyword: 'a.b:>=1', // 2 consecutive properties (not including array indices)
});
filter(array, {
  keyword: 'b:>1', // 2 consecutive properties (not including array indices)
});
filter(array, {
  keyword: 'd:2', // 2 consecutive properties (not including array indices)
});
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/smart-array-filter.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/smart-array-filter
[travis-image]: https://img.shields.io/travis/cheminfo/smart-array-filter/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/cheminfo/smart-array-filter
[coveralls-image]: https://img.shields.io/coveralls/cheminfo/smart-array-filter.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/cheminfo/smart-array-filter
[download-image]: https://img.shields.io/npm/dm/smart-array-filter.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/smart-array-filter
