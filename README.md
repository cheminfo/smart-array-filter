# smart-array-filter

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![npm download][download-image]][download-url]

Filter an array of objects

## Installation

`npm install smart-array-filter`

## Documentation

### Basic usage

```js
const array = [
  {
    name: 'Cheetah',
    lifeExpectancy: 10,
    taxonomy: {
      phylum: 'Chordata',
      class: 'Mammalia',
      order: 'Carnivora',
      family: 'Felidae',
    },
    characteristics: {
      prey: 'Gazelle, Wildebeest, Hare',
      distinctiveFeature: 'Yellowish fur covered in small black spots',
    },
    locations: ['Africa', 'Asia', 'Eurasia'],
  },
  {
    name: 'Gorilla',
    lifeExpectancy: 40,
    taxonomy: {
      phylum: 'Chordata',
      class: 'Mammalia',
      order: 'Primates',
      family: 'Hominidae',
    },
    locations: ['Africa'],
  },
];
const filteredData = filter(array, {
  keywords: 'gorilla', // search for any field that contains the "gorilla" string
});
```

### Options

| Option          | Type                   | Default    | Description                                               |
| --------------- | ---------------------- | ---------- | --------------------------------------------------------- |
| `keywords`      | `string` or `string[]` | `[]`       | The list of keywords to search for.                       |
| `limit`         | `number`               | `Infinity` | The maximum number of results to return.                  |
| `caseSensitive` | `boolean`              | `false`    | Whether the search should be case sensitive.              |
| `predicate`     | `"AND"` or `"OR"`      | `"AND"`    | The predicate to use to combine matches between keywords. |
| `depth`         | `number`               | `Infinity` | The depth to which the objects are inspected.             |
| `includePaths`  | `string[]`             | `[]`       | The paths to include when searching for matches.          |
| `ignorePaths`   | `string[]`             | `[]`       | The paths to ignore when searching for matches.           |

### Recursivity

By default, objects are inspected recursively. This means that if your data has circular references, it might throw a `RangeError: Maximum call stack size exceeded` error.

To limit recursivity at a certain depth, you can set the `depth` option.

### Search within specific fields

To search within a specific key, you can prefix your search term with the field's key followed by a colon.

`name:Gorilla` will match the `name` field of the Gorilla entry.
`order:Primates` will match the `taxonomy.order` field of the Gorilla entry.
`taxonomy.order` will match the `taxonomy.order` field of the Gorilla entry.

You can use the `includePaths` or the `ignorePaths` options to define which fields should be included or ignored when finding search matches.

### Keywords

The keywords option can be a string or an array of strings.

If it's a string it will be split by space / newlines and each part will be considered as a keyword. When searching for content with spaces or newlines, the content must be enclosed in double quotes.

- 🚫 `{ keywords: 'distinctiveFeature:black spots' }` this creates 2 keywords
- ✅ `{ keywords: 'distinctiveFeature:"black spots"' }`

If `keywords` is an array of strings, each string will be considered as a keyword and there is no need for enclosing spaces in double quotes.

✅ `{ keywords: [ 'distinctiveFeature:black spots' ] }`

### Operators

- No operator: `name:Gori` will match the Gorilla entry because the name contains `"Gori"`.
- Strict equality: `name:=Gorilla` will match the `name`, but not `name:=Gorill`.
- Range operators
  - `>`, `>=`, `<`, `<=`. Example: `lifeExpectancy:>=40`
  - `..` to define a range. Example: `lifeExpectancy:10..40`
  - The range operators also work with strings, using the ascii code.
- Negation: `-name:Gorilla` will match all entries except the ones which match `name:Gorilla`. This operator can be combined with other operators: `-name:=Gorilla`.

### Search within arrays

Arrays are traversed like objects, but inherit their parent's field name. For example in the Cheetah example, `locations: ['Africa', 'Asia', 'Eurasia']` behaves as if there were 3 different properties but all with the `locations` name.

Any of those keywords will match the Cheetah entry:
`locations:Africa`, `locations:Asia`, `locations:Eurasia`

### Search predicate

By default, the search using the `"AND"` predicate, which is returning the intersection of the matches across all keywords. You can change this behavior by setting the `predicate` option to `"OR"`.

```js
filter(animals, {
  keywords: ['Gorilla', 'Cheetah'],
  predicate: 'OR', // will return the union of the matches on the "Gorilla" and "Cheetah" keywords
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
