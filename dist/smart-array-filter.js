/**
 * smart-array-filter - Filter an array of objects
 * @version v2.0.3
 * @link https://github.com/cheminfo/smart-array-filter
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.smartArrayFilter = {}));
}(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */

	/** Used as references for various `Number` constants. */

	var INFINITY = 1 / 0;
	/** `Object#toString` result references. */

	var symbolTag = '[object Symbol]';
	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
	 */

	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
	    reHasRegExpChar = RegExp(reRegExpChar.source);
	/** Detect free variable `global` from Node.js. */

	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
	/** Detect free variable `self`. */

	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
	/** Used as a reference to the global object. */

	var root = freeGlobal || freeSelf || Function('return this')();
	/** Used for built-in method references. */

	var objectProto = Object.prototype;
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */

	var objectToString = objectProto.toString;
	/** Built-in value references. */

	var Symbol = root.Symbol;
	/** Used to convert symbols to primitives and strings. */

	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;
	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */

	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }

	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }

	  var result = value + '';
	  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
	}
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */


	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */


	function isSymbol(value) {
	  return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
	}
	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */


	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}
	/**
	 * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
	 * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escapeRegExp('[lodash](https://lodash.com/)');
	 * // => '\[lodash\]\(https://lodash\.com/\)'
	 */


	function escapeRegExp(string) {
	  string = toString(string);
	  return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string;
	}

	var lodash_escaperegexp = escapeRegExp;

	const operators = {
	  '<': query => {
	    return function (number) {
	      return number < query;
	    };
	  },
	  '<=': query => {
	    return function (number) {
	      return number <= query;
	    };
	  },
	  '=': query => {
	    return function (number) {
	      return number === query;
	    };
	  },
	  '>=': query => {
	    return function (number) {
	      return number >= query;
	    };
	  },
	  '>': query => {
	    return function (number) {
	      return number > query;
	    };
	  }
	}; // we also deal with ..10 and 10..

	operators['..'] = operators['<='];
	function getCheckNumber(keyword) {
	  let match = /^\s*\(?\s*(<|<=|=|>=|>|\.\.)?(-?\d*\.?\d+)(?:(\.\.)(-?\d*\.?\d*))?\s*\)?\s*$/.exec(keyword);

	  let checkNumber = () => false;

	  if (match) {
	    let operator = match[1];
	    let query = parseFloat(match[2]);
	    let dots = match[3];
	    let secondQuery = match[4];

	    if (operator) {
	      checkNumber = operators[operator](query);
	    } else if (dots) {
	      if (secondQuery !== '') {
	        secondQuery = parseFloat(secondQuery);

	        checkNumber = function (number) {
	          return query <= number && number <= secondQuery;
	        };
	      } else {
	        checkNumber = operators['>='](query);
	      }
	    } else {
	      checkNumber = operators['='](query);
	    }
	  }

	  return checkNumber;
	}

	const operators$1 = {
	  '<': query => {
	    return function (string) {
	      return string < query;
	    };
	  },
	  '<=': query => {
	    return function (string) {
	      return string <= query;
	    };
	  },
	  '=': (query, insensitive) => {
	    query = `^${lodash_escaperegexp(query)}$`;
	    const reg = new RegExp(query, insensitive);
	    return function (string) {
	      return reg.test(string);
	    };
	  },
	  '~': (query, insensitive) => {
	    query = lodash_escaperegexp(query);
	    const reg = new RegExp(query, insensitive);
	    return function (string) {
	      return reg.test(string);
	    };
	  },
	  '>=': query => {
	    return function (string) {
	      return string >= query;
	    };
	  },
	  '>': query => {
	    return function (string) {
	      return string > query;
	    };
	  }
	};
	operators$1['..'] = operators$1['<='];
	function getCheckString(keyword, insensitive) {
	  let parts = keyword.split('..');
	  let match = /^\s*\(?\s*(<|<=|=|>=|>)?(\S*)\s*\)?$/.exec(parts[0]);

	  let checkString = () => false;

	  if (match) {
	    let operator = match[1];
	    let query = match[2];
	    let dots = parts.length > 1 ? '..' : '';
	    let secondQuery = parts[1];

	    if (operator) {
	      checkString = operators$1[operator](query, insensitive);
	    } else if (dots) {
	      if (secondQuery !== '') {
	        checkString = function (string) {
	          return query <= string && string <= secondQuery;
	        };
	      } else {
	        checkString = operators$1['>='](query, insensitive);
	      }
	    } else {
	      checkString = operators$1['~'](query, insensitive);
	    }
	  }

	  return checkString;
	}

	let separators = /[ ;,\t\r\n]/;
	function parseKeywords(keywords) {
	  let result = [];
	  let inQuotes = false;
	  let inSeparator = true;
	  let currentWord = [];
	  let previous = '';

	  for (let i = 0; i < keywords.length; i++) {
	    let current = keywords.charAt(i);

	    if (inQuotes) {
	      if (previous === '"') {
	        // escaped quote
	        if (current === '"') {
	          previous = '';
	          continue;
	        } // end of quoted part


	        currentWord.pop(); // remove last quote that was added

	        inQuotes = false;
	        i--;
	        continue;
	      }

	      currentWord.push(current);
	      previous = current;
	      continue;
	    }

	    if (inSeparator) {
	      // still in separator ?
	      if (separators.test(current)) {
	        previous = current;
	        continue;
	      }

	      inSeparator = false;
	    } // start of quoted part


	    if (current === '"') {
	      inQuotes = true;
	      previous = '';
	      continue;
	    } // start of separator part


	    if (separators.test(current)) {
	      if (currentWord.length) result.push(currentWord.join(''));
	      currentWord = [];
	      inSeparator = true;
	      continue;
	    }

	    currentWord.push(current);
	    previous = '';
	  }

	  if (previous === '"') currentWord.pop();
	  if (currentWord.length) result.push(currentWord.join(''));
	  return result;
	}

	/**
	 *
	 * @param {Array} array
	 * @param {object} [options={}]
	 * @param {number} [options.limit=Infinity]
	 * @param {boolean} [options.caseSensitive=false]
	 * @param {string|Array} [options.keywords=[]]
	 * @param {boolean} [options.index=false] Returns the indices in the array that match
	 * @param {boolean} [options.predicate='AND'] Could be either AND or OR
	 */

	function filter(array, options = {}) {
	  let result = [];
	  let {
	    index = false,
	    predicate = 'AND'
	  } = options;
	  let limit = options.limit ? options.limit : Infinity;
	  let keywords = options.keywords || [];
	  let insensitive = options.caseSensitive ? '' : 'i';

	  if (typeof keywords === 'string') {
	    keywords = parseKeywords(keywords);
	  }

	  keywords = keywords.map(function (keyword) {
	    let criterion = {
	      is: false,
	      key: false,
	      negate: false,
	      valueReg: undefined
	    };

	    if (keyword.charAt(0) === '-') {
	      criterion.negate = true;
	      keyword = keyword.substring(1);
	    }

	    let colon = keyword.indexOf(':');

	    if (colon > -1) {
	      let value = keyword.substring(colon + 1);

	      if (colon > 0) {
	        let key = keyword.substring(0, colon);

	        if (key === 'is') {
	          // a property path exists
	          criterion.is = new RegExp(`(^|\\.)${lodash_escaperegexp(value)}(\\.|$)`, insensitive);
	        }

	        criterion.key = new RegExp(`(^|\\.)${lodash_escaperegexp(key)}(\\.|$)`, insensitive);
	      }

	      fillCriterion(criterion, value, insensitive);
	    } else {
	      fillCriterion(criterion, keyword, insensitive);
	    }

	    return criterion;
	  });
	  let matched = 0;

	  for (let i = 0; i < array.length && matched < limit; i++) {
	    if (match(array[i], keywords, predicate)) {
	      matched = result.push(index ? i : array[i]);
	    }
	  }

	  return result;
	}

	function fillCriterion(criterion, keyword, insensitive) {
	  criterion.checkString = getCheckString(keyword, insensitive);
	  criterion.checkNumber = getCheckNumber(keyword);
	}

	function match(element, keywords, predicate) {
	  if (keywords.length) {
	    let found = false;

	    for (let i = 0; i < keywords.length; i++) {
	      // match XOR negate
	      if (recursiveMatch(element, keywords[i], []) ? !keywords[i].negate : keywords[i].negate) {
	        if (predicate === 'OR') {
	          return true;
	        }

	        found = true;
	      } else if (predicate === 'AND') {
	        return false;
	      }
	    }

	    return found;
	  }

	  return true;
	}

	function recursiveMatch(element, keyword, keys) {
	  if (typeof element === 'object') {
	    if (Array.isArray(element)) {
	      for (let i = 0; i < element.length; i++) {
	        if (recursiveMatch(element[i], keyword, keys)) {
	          return true;
	        }
	      }
	    } else {
	      for (let i in element) {
	        keys.push(i);
	        let didMatch = recursiveMatch(element[i], keyword, keys);
	        keys.pop();
	        if (didMatch) return true;
	      }
	    }
	  } else if (keyword.is) {
	    // we check for the presence of a key (jpath)
	    if (keyword.is.test(keys.join('.'))) {
	      return !!element;
	    } else {
	      return false;
	    }
	  } else {
	    // need to check if keys match
	    if (keyword.key && !keyword.key.test(keys.join('.'))) return false; //if (key && keyword.key && key !== keyword.key) return false;

	    return nativeMatch(element, keyword);
	  }
	}

	function nativeMatch(element, keyword) {
	  if (typeof element === 'string') {
	    return keyword.checkString(element);
	  } else if (typeof element === 'number') {
	    return keyword.checkNumber(element);
	  } else {
	    return false;
	  }
	}

	exports.filter = filter;
	exports.match = match;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=smart-array-filter.js.map
