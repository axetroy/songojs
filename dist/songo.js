(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["songo"] = factory();
	else
		root["songo"] = factory();
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
	var metaParser_1 = __webpack_require__(1);
	var sortParser_1 = __webpack_require__(3);
	var queryParser_1 = __webpack_require__(4);
	var default_1 = __webpack_require__(2);
	var GLOBAL = this;
	function songo(entity) {
	    return new Songo(entity);
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = songo;
	function encode(encodeString) {
	    return GLOBAL.btoa ? GLOBAL.btoa(encodeString) : encodeURIComponent(encodeString);
	}
	function decode(decodeString) {
	    decodeString = decodeURIComponent(decodeString);
	    var result;
	    try {
	        result = JSON.parse(decodeString);
	    }
	    catch (e) {
	        result = {};
	    }
	    return result;
	}
	var Songo = (function () {
	    function Songo(entity) {
	        if (entity === void 0) { entity = default_1.DEFAULT_ENTITY; }
	        this.REG = /^([-\+])(\w+)$/i;
	        // make sure attr has been set
	        entity.meta = entity.meta || {};
	        entity.sort = entity.sort || [];
	        entity.query = entity.query || {};
	        // set the default value
	        entity.meta.page = entity.meta.page !== void 0 ? entity.meta.page : default_1.DEFAULT_PAGE;
	        entity.meta.limit = entity.meta.limit !== void 0 ? entity.meta.limit : default_1.DEFAULT_LIMIT;
	        entity.meta.skip = entity.meta.skip !== void 0 ? entity.meta.skip : default_1.DEFAULT_SKIP;
	        this.meta = entity.meta;
	        this.sort = entity.sort;
	        this.query = entity.query;
	        this.parse();
	    }
	    Songo.prototype.parse = function () {
	        this.Meta = metaParser_1.metaParser(this.meta);
	        this.Sort = sortParser_1.sortParser(this.sort);
	        this.Query = queryParser_1.queryParser(this.query);
	    };
	    Object.defineProperty(Songo.prototype, "string", {
	        get: function () {
	            return this.toString();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Songo.prototype.toQuery = function () {
	        return this.toString();
	    };
	    /**
	     *  转换成适合在url上防止的对象
	     */
	    Songo.prototype.toParams = function () {
	        this.parse();
	        return {
	            limit: this.Meta.limit,
	            page: this.Meta.page,
	            skip: this.Meta.skip,
	            sort: this.Sort.normalize(),
	            query: encode(JSON.stringify(this.query)) // base64加密 || 转码
	        };
	    };
	    /**
	     * 将一个params对象，转化为实例
	     * @param paramsObject
	     * @returns {Songo}
	     */
	    Songo.prototype.fromParams = function (paramsObject) {
	        var limit = paramsObject.limit, page = paramsObject.page, skip = paramsObject.skip, sort = paramsObject.sort, query = paramsObject.query;
	        if (limit !== void 0)
	            this.meta.limit = limit;
	        if (page !== void 0)
	            this.meta.page = page;
	        if (skip !== void 0)
	            this.meta.skip = skip;
	        if (sort !== void 0)
	            this.sort = typeof sort === 'string' ? sort.split(',') : Array.isArray(sort) ? sort : [];
	        if (query !== void 0)
	            this.query = decode(query); // base64解密 || 转码
	        return this;
	    };
	    /**
	     * 转换成最终的url字符串
	     * @returns {string}
	     */
	    Songo.prototype.toString = function () {
	        this.parse();
	        return [this.Meta, this.Sort, this.Query]
	            .filter(function (v) { return v + ''; })
	            .join('&');
	    };
	    Songo.prototype.clearSort = function () {
	        this.sort = [];
	        this.parse();
	        return this;
	    };
	    Songo.prototype.indexSort = function (sortKey) {
	        return this.sort.map(function (v) { return v.replace(/^[\-\+]/, ''); }).indexOf(sortKey.replace(/^[\-\+]/, ''));
	    };
	    /**
	     * 仅仅按照一个key排序
	     * @param sortKey
	     * @returns {Songo}
	     */
	    Songo.prototype.onlySort = function (sortKey) {
	        this.sort = [sortKey];
	        this.parse();
	        return this;
	    };
	    /**
	     * 添加一个sort
	     * @param sortKey
	     */
	    Songo.prototype.setSort = function (sortKey) {
	        var index = this.indexSort(sortKey);
	        // check the attr exist or not
	        if (index >= 0) {
	            this.sort.splice(index, 1);
	            this.unshiftSort(sortKey);
	        }
	        else {
	            this.unshiftSort(sortKey);
	        }
	        this.parse();
	        return this;
	    };
	    Songo.prototype.unshiftSort = function (sortKey) {
	        var index = this.indexSort(sortKey);
	        // check the attr exist or not
	        if (index >= 0)
	            this.sort.splice(index, 1);
	        this.sort.unshift(sortKey);
	        this.parse();
	        return this;
	    };
	    Songo.prototype.removeSort = function (sortKey) {
	        var index = this.indexSort(sortKey);
	        if (index >= 0)
	            this.sort.splice(index, 1);
	        this.parse();
	        return this;
	    };
	    Songo.prototype.pushSort = function (sortKey) {
	        var index = this.indexSort(sortKey);
	        // check the attr exist or not
	        if (index >= 0)
	            this.sort.splice(index, 1);
	        this.sort.push(sortKey);
	        this.parse();
	        return this;
	    };
	    Songo.prototype.popSort = function () {
	        this.sort.pop();
	        this.parse();
	        return this;
	    };
	    Songo.prototype.shiftSort = function () {
	        this.sort.shift();
	        this.parse();
	        return this;
	    };
	    return Songo;
	}());


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by axetroy on 16-9-16.
	 */
	"use strict";
	var default_1 = __webpack_require__(2);
	var Meta = (function () {
	    function Meta(limit, page, skip) {
	        this.limit = limit;
	        this.page = page;
	        this.skip = skip;
	        this._limit = limit;
	        this._page = page;
	        this._skip = skip;
	    }
	    Meta.prototype.toString = function () {
	        return "_limit=" + this.limit + "&_page=" + this.page + "&_skip=" + this.skip;
	    };
	    Meta.prototype.toJson = function (replacer, space) {
	        return JSON.stringify(this.toObject(), replacer, space);
	    };
	    Meta.prototype.toObject = function () {
	        return {
	            _limit: this._limit,
	            _page: this._page,
	            _skip: this._skip
	        };
	    };
	    return Meta;
	}());
	function metaParser(meta) {
	    if (meta === void 0) { meta = {
	        limit: default_1.DEFAULT_LIMIT,
	        page: default_1.DEFAULT_PAGE,
	        skip: default_1.DEFAULT_SKIP
	    }; }
	    var limit = meta.limit || default_1.DEFAULT_LIMIT;
	    var page = meta.page || default_1.DEFAULT_PAGE;
	    var skip = meta.skip || default_1.DEFAULT_SKIP;
	    return new Meta(limit, page, skip);
	}
	exports.metaParser = metaParser;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Created by axetroy on 16-9-16.
	 */
	"use strict";
	var DEFAULT_QUERY = {};
	exports.DEFAULT_QUERY = DEFAULT_QUERY;
	var DEFAULT_SORT = '-created';
	exports.DEFAULT_SORT = DEFAULT_SORT;
	var DEFAULT_LIMIT = 10;
	exports.DEFAULT_LIMIT = DEFAULT_LIMIT;
	var DEFAULT_PAGE = 0;
	exports.DEFAULT_PAGE = DEFAULT_PAGE;
	var DEFAULT_SKIP = 0;
	exports.DEFAULT_SKIP = DEFAULT_SKIP;
	var DEFAULT_ENTITY = {
	    query: DEFAULT_QUERY,
	    sort: [DEFAULT_SORT],
	    limit: DEFAULT_LIMIT,
	    page: DEFAULT_PAGE,
	    skip: DEFAULT_SKIP
	};
	exports.DEFAULT_ENTITY = DEFAULT_ENTITY;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Created by axetroy on 16-9-16.
	 */
	"use strict";
	function sortParser(sort) {
	    if (sort === void 0) { sort = []; }
	    sort = sort.length ? sort : [];
	    return new Sort(sort);
	}
	exports.sortParser = sortParser;
	var Sort = (function () {
	    function Sort(sortArray) {
	        var _this = this;
	        this.sortArray = sortArray;
	        if (Array.isArray(sortArray) && sortArray.length) {
	            sortArray.forEach(function (v, i) { return _this[i] = v; });
	        }
	    }
	    Sort.prototype.normalize = function () {
	        return this.sortArray.map(function (v) { return v.replace(/^\+/, ''); }).join(',');
	    };
	    Sort.prototype.toString = function () {
	        return 'sort=' + this.normalize();
	    };
	    return Sort;
	}());


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Created by axetroy on 16-9-16.
	 */
	"use strict";
	/**
	 *
	 * @param operatorStr
	 * @param value
	 * @param context
	 * @returns {any}
	 */
	function parse(operatorStr, value, context) {
	    if (context === void 0) { context = {}; }
	    if (value === void 0 || value === null || value === '')
	        return;
	    var operators = operatorStr.match(/((?=\$)?[^\$]+(?=\$))/ig);
	    var logicOP = operators.length > 1 ? operators.slice(0, operators.length - 1) : []; // 逻辑运算符
	    var compareOP = operators[operators.length - 1]; // 比较运算符
	    var key = operatorStr.match(/((?=\$)?\w+(?!=\$))$/i)[1]; // 查询key名
	    var logicStr = logicOP.length ? '$' + logicOP.join('$') + '$' : '';
	    context[("" + logicStr + key)] = context[("" + logicStr + key)] || [];
	    context[("" + logicStr + key)].push('$' + compareOP + '$' + value);
	    return context;
	}
	function each(object, iterator) {
	    if (!object || !Object.keys(object))
	        return;
	    for (var key in object) {
	        if (object.hasOwnProperty(key)) {
	            typeof iterator === 'function' && iterator.call(object, object[key], key, object);
	        }
	    }
	}
	function queryParser(queryObject) {
	    if (queryObject === void 0) { queryObject = {}; }
	    return new Query(queryObject);
	}
	exports.queryParser = queryParser;
	var Query = (function () {
	    function Query(queryObject) {
	        this.queryObject = queryObject;
	        this.query = {};
	        this.object = {};
	        this.parse(queryObject);
	    }
	    Query.prototype.parse = function (queryObject) {
	        var _this = this;
	        /**
	         * 覆盖this.object对象
	         * 保持 key = [value]   的形式
	         */
	        each(queryObject, function (value, key) {
	            if (!/^\$[^\$]{2}\$/.test(key))
	                return;
	            parse(key, value, _this.object);
	        });
	        /**
	         * 覆盖this.query对象
	         * 将this.object 转化为如下格式:
	         * key = value1,value2,value3
	         */
	        each(this.object, function (value, key) {
	            _this.query[key] = value.sort().join(',');
	        });
	    };
	    Object.defineProperty(Query.prototype, "string", {
	        get: function () {
	            return this.toString();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Query.prototype.toJson = function (replacer, space) {
	        return JSON.stringify(this.toObject(), replacer, space);
	    };
	    Query.prototype.toObject = function () {
	        return this.object;
	    };
	    Query.prototype.toString = function () {
	        var arr = [];
	        each(this.query, function (value, key) {
	            arr.push(key + '=' + value);
	        });
	        arr.sort();
	        return arr.join('&');
	    };
	    return Query;
	}());


/***/ }
/******/ ])
});
;