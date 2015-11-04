(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["smartArrayFilter"] = factory();
	else
		root["smartArrayFilter"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	module.exports = filter;
	module.exports.match = match;

	function filter(array, options) {
	    options = options || {};
	    var result = [];

	    var insensitive = options.caseSensitive ? '' : 'i';
	    var keywords = options.keywords;
	    if (typeof keywords === 'string') {
	        keywords = keywords.split(/[ ;,\t\r\n]+/);
	    }
	    keywords = keywords.map(function (keyword) {
	        return new RegExp(keyword, insensitive);
	    });
	    for (var i = 0; i < array.length; i++) {
	        if (match(array[i], keywords, options.predicate || 'AND')) {
	            result.push(array[i]);
	        }
	    }
	    return result;
	}

	function match(element, keywords, predicate) {
	    var found = false;
	    if (keywords) {
	        for (var i = 0; i < keywords.length; i++) {
	            if (recursiveMatch(element, keywords[i])) {
	                if (predicate === 'OR') {
	                    return true;
	                }
	                found = true;
	            } else if (predicate === 'AND') {
	                return false;
	            }
	        }
	    }
	    return found;
	}

	function recursiveMatch(element, keyword) {
	    if (typeof element === 'object') {
	        if (Array.isArray(element)) {
	            for (var i = 0; i < element.length; i++) {
	                if (recursiveMatch(element[i], keyword)) {
	                    return true;
	                }
	            }
	        } else {
	            for (var i in element) {
	                if (recursiveMatch(element[i], keyword)) {
	                    return true;
	                }
	            }
	        }
	    } else if (typeof element === 'string') {
	        return keyword.test(element);
	    } else if (typeof element === 'number') {
	        return keyword.test(String(element));
	    }
	    return false;
	}


/***/ }
/******/ ])
});
;