(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["sqlKit"] = factory();
	else
		root["sqlKit"] = factory();
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
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var queryParser = __webpack_require__(1);
	var metaParser = __webpack_require__(2);
	var sortParser = __webpack_require__(4);
	function default_1() {
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = default_1;
	function songo(any) { }
	songo({
	    limit: 10,
	    page: 0,
	    skip: 0,
	    sort: ['-created'],
	    query: {
	        currency: '$eq$USD'
	    }
	});
	var s = '?_limit=10&_page=0&_skip=0&sort=-created&$and$currency=$eq$USD';


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Created by axetroy on 16-9-16.
	 */
	function parser(operators, context, attr, value) {
	    if (context === void 0) { context = {}; }
	    var _context = context['%' + operators[0]] = context['%' + operators[0]] || {};
	    switch (operators.length) {
	        case 0:
	            break;
	        case 1:
	            value !== void 0 ? context['%' + operators[0]][attr] = value : void 0;
	            break;
	        default:
	            operators.shift();
	            return parser(operators, _context, attr, value);
	    }
	    return context;
	}
	function parse(operatorStr, value, context) {
	    if (context === void 0) { context = {}; }
	    var operators = operatorStr.match(/((?=\$)?[^\$]+(?=\$))/ig);
	    var attr = operatorStr.match(/((?=\$)?\w+(?!=\$))$/i);
	    parser(operators, context, attr[1], value);
	    return context;
	}
	function queryParser(queryObject) {
	    var query = {};
	    for (var multiOp in queryObject) {
	        if (queryObject.hasOwnProperty(multiOp)) {
	            parse(multiOp, queryObject[multiOp], query);
	        }
	    }
	    return query;
	}
	module.exports = queryParser;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by axetroy on 16-9-16.
	 */
	var _a = __webpack_require__(3), DEFAULT_LIMIT = _a.DEFAULT_LIMIT, DEFAULT_PAGE = _a.DEFAULT_PAGE, DEFAULT_SKIP = _a.DEFAULT_SKIP;
	function metaParser(_a) {
	    var _b = _a === void 0 ? {
	        limit: DEFAULT_LIMIT,
	        page: DEFAULT_PAGE,
	        skip: DEFAULT_SKIP
	    } : _a, _c = _b.limit, limit = _c === void 0 ? DEFAULT_LIMIT : _c, _d = _b.page, page = _d === void 0 ? DEFAULT_PAGE : _d, _e = _b.skip, skip = _e === void 0 ? DEFAULT_SKIP : _e;
	    return {
	        '%p': page,
	        '%l': limit,
	        '%s': skip
	    };
	}
	module.exports = metaParser;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Created by axetroy on 16-9-16.
	 */
	var DEFAULT_QUERY = {};
	var DEFAULT_SORT = '-created';
	var DEFAULT_LIMIT = 10;
	var DEFAULT_PAGE = 0;
	var DEFAULT_SKIP = 0;
	var DEFAULT_ENTITY = {
	    query: DEFAULT_QUERY,
	    sort: [DEFAULT_SORT],
	    meta: {
	        limit: DEFAULT_LIMIT,
	        page: DEFAULT_PAGE,
	        skip: DEFAULT_SKIP
	    }
	};
	exports.DEFAULT_QUERY = DEFAULT_QUERY;
	exports.DEFAULT_SORT = DEFAULT_SORT;
	exports.DEFAULT_LIMIT = DEFAULT_LIMIT;
	exports.DEFAULT_PAGE = DEFAULT_PAGE;
	exports.DEFAULT_SKIP = DEFAULT_SKIP;
	exports.DEFAULT_ENTITY = DEFAULT_ENTITY;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by axetroy on 16-9-16.
	 */
	var DEFAULT_SORT = __webpack_require__(3).DEFAULT_SORT;
	function sortParser(sort) {
	    if (sort === void 0) { sort = DEFAULT_SORT; }
	    return Array.isArray(sort) ? sort : [sort];
	}
	module.exports = sortParser;


/***/ }
/******/ ])
});
;