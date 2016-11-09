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
	/**
	 * 字符串转码
	 * @param encodeString {string} 要转码的字符串
	 * @returns {string}
	 */
	function encode(encodeString) {
	    return GLOBAL.btoa ? GLOBAL.btoa(encodeString) : encodeURIComponent(encodeString);
	}
	/**
	 * 字符串解码，并且还原为object
	 * @param decodeString  {string}
	 * @returns {{}}
	 */
	function decode(decodeString) {
	    decodeString = decodeURIComponent(decodeString);
	    var result = {};
	    try {
	        result = JSON.parse(decodeString);
	    }
	    catch (e) {
	        result = {};
	    }
	    return result;
	}
	/**
	 * @class
	 * @classdesc 用来构建songo协议的对象
	 * @property query  {object<string, (string | string[])>}  全部是以key-value的形式,不能有任何形式的嵌套
	 * @property sort   {Array<string>} 字符串数组，按照顺序描述排序
	 * @property meta   {{meta:number,page:number,limit:number,skip:number}}  可选字段[limit,page,skip]筛选对象，接受数字
	 * @property string {string} 获取转换的url字符串
	 * @property Query {Query} 内部的Query对象
	 * @property Sort {Sort} 内部的Sort对象
	 * @property Meta {Meta} 内部的Meta对象
	 * @example
	 *    new Songo({
	 *      query:{
	 *        $eq$status:1,
	 *        $gt$money:100
	 *      },
	 *      sort:['created'],
	 *      meta:{
	 *        limit:10,
	 *        page:0,
	 *        skip:0
	 *      }
	 *    })
	 * @author Axetroy <troy450409405@gmail.com>
	 */
	var Songo = (function () {
	    /**
	     * @param [entity=object.<>] {{query:object,sort:string[],meta:object<string,number>}}
	     *    实例化Songo类的参数，包含3个字段:[query,sort,meta]
	     * @returns{Songo}
	     */
	    function Songo(entity) {
	        if (entity === void 0) { entity = default_1.DEFAULT_ENTITY; }
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
	    /**
	     * @private
	     */
	    Songo.prototype.parse = function () {
	        this.Meta = metaParser_1.metaParser(this.meta);
	        this.Sort = sortParser_1.sortParser(this.sort);
	        this.Query = queryParser_1.queryParser(this.query);
	    };
	    Object.defineProperty(Songo.prototype, "string", {
	        /**
	         * 获取转换的url字符串
	         * @readonly
	         * @returns {string}
	         */
	        get: function () {
	            return this.toString();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * toString方法的别名
	     * @example
	     *    let songo = new Songo();
	     *    songo.toQuery()
	     * @returns {string}
	     */
	    Songo.prototype.toQuery = function () {
	        return this.toString();
	    };
	    /**
	     * 转换成适合在url上防止的对象
	     * @example
	     *    let songo = new Songo({
	     *      meta:{
	     *        limit:10,
	     *        page:0
	     *      }
	     *    });
	     *    songo.toParams()    // ?_limit=10&_page=0
	     * @returns {Params}
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
	     * @param paramsObject {Params.<string, (number|string)>}
	     *    类似angular的ui-router中的$stateParams，url的query转化为plainObject
	     * @example
	     *    let songo = new Songo({});
	     *    songo.fromParams({
	     *      limit:10,
	     *      page:20
	     *    })
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
	     * @override
	     * @this Songo
	     * @returns {string}
	     */
	    Songo.prototype.toString = function () {
	        this.parse();
	        return [this.Meta, this.Sort, this.Query]
	            .filter(function (v) { return v + ''; })
	            .join('&');
	    };
	    /**
	     * 清空排序队列
	     * @example
	     *    let songo = new Songo({sort:['-create']});
	     *    songo.clearSort();
	     * @returns {Songo}
	     */
	    Songo.prototype.clearSort = function () {
	        this.sort = [];
	        this.parse();
	        return this;
	    };
	    /**
	     * 索引一个sortKey
	     * @param sortKey {string}  排序key，例如"+created","-created";默认+可以不填
	     * @example
	     *    let songo = new Songo({sort:['-create']});
	     *    songo.indexSort('created');   // 0
	     * @returns {number}
	     */
	    Songo.prototype.indexSort = function (sortKey) {
	        return this.sort.map(function (v) { return v.replace(/^[\-\+]/, ''); }).indexOf(sortKey.replace(/^[\-\+]/, ''));
	    };
	    /**
	     * 仅仅按照一个key排序
	     * @param sortKey
	     * @example
	     *    let songo = new Songo({sort:['-create']});
	     *    songo.onlySort('-money');
	     *    console.log(songo.sort);    // ['-money']
	     * @returns {Songo}
	     */
	    Songo.prototype.onlySort = function (sortKey) {
	        this.sort = [sortKey];
	        this.parse();
	        return this;
	    };
	    /**
	     * 添加一个sort
	     * @param sortKey {string} 排序key，例如"+created","-created";默认+可以不填
	     * @example
	     *    let songo = new Songo({sort:['-create']});
	     *    songo.setSort('created');       // songo.sort >>  ['created']
	     *    songo.setSort('-money');        // songo.sort >>  ['-money','created']
	     *    songo.setSort('level');         // songo.sort >>  ['level','-money','created']
	     *    songo.setSort('-created');      // songo.sort >>  ['created','level','-money']
	     *
	     * @returns {Songo}
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
	    /**
	     * 在队列第一个插入，类似Array.prototype.unshift
	     * @param sortKey {string}  排序key，例如"+created","-created";默认+可以不填
	     * @example
	     *    let songo = new Songo({sort:['-create']});
	     *    songo.unshiftSort('created');       // songo.sort >>  ['created']
	     *    songo.unshiftSort('level');         // songo.sort >>  ['level','created']
	     *    songo.unshiftSort('-money');        // songo.sort >>  ['money','level','created']
	     * @returns {Songo}
	     */
	    Songo.prototype.unshiftSort = function (sortKey) {
	        var index = this.indexSort(sortKey);
	        // check the attr exist or not
	        if (index >= 0)
	            this.sort.splice(index, 1);
	        this.sort.unshift(sortKey);
	        this.parse();
	        return this;
	    };
	    /**
	     * 删除其中的某个sortKey
	     * @param sortKey {string}  排序key，例如"+created","-created";默认+可以不填
	     * @example
	     *    let songo = new Songo({sort:['money','level','created']});
	     *    songo.removeSort('created');        // songo.sort >>  ['money','level']
	     *    songo.removeSort('money');          // songo.sort >>  ['level']
	     *    songo.removeSort('-level');         // songo.sort >>  ['level']
	     * @returns {Songo}
	     */
	    Songo.prototype.removeSort = function (sortKey) {
	        var index = this.indexSort(sortKey);
	        if (index >= 0)
	            this.sort.splice(index, 1);
	        this.parse();
	        return this;
	    };
	    /**
	     * 在队列最后一个添加sortKey，类似Array.prototype.push
	     * @param sortKey {string}  排序key，例如"+created","-created";默认+可以不填
	     * @example
	     *    let songo = new Songo({sort:['created']});
	     *    songo.pushSort('level');        // songo.sort >>  ['created','level']
	     *    songo.pushSort('money');        // songo.sort >>  ['created','level','money']
	     *    songo.pushSort('level');        // songo.sort >>  ['created','money','level']
	     * @returns {Songo}
	     */
	    Songo.prototype.pushSort = function (sortKey) {
	        var index = this.indexSort(sortKey);
	        // check the attr exist or not
	        if (index >= 0)
	            this.sort.splice(index, 1);
	        this.sort.push(sortKey);
	        this.parse();
	        return this;
	    };
	    /**
	     * 删除队列的最后一个,，类似Array.prototype.pop，但是不会返回被删除的对象
	     * @example
	     *    let songo = new Songo({sort:['money','level','created']});
	     *    songo.popSort();        // songo.sort >>  ['money','level']
	     *    songo.popSort();        // songo.sort >>  ['money']
	     *    songo.popSort();        // songo.sort >>  []
	     * @returns {Songo}
	     */
	    Songo.prototype.popSort = function () {
	        this.sort.pop();
	        this.parse();
	        return this;
	    };
	    /**
	     * 除队列的第一个，类似Array.prototype.shift，但是不会返回被删除的对象
	     * @example
	     *    let songo = new Songo({sort:['money','level','created']});
	     *    songo.shiftSort();        // songo.sort >>  ['level','created']
	     *    songo.shiftSort();        // songo.sort >>  ['created']
	     *    songo.shiftSort();        // songo.sort >>  []
	     * @returns {Songo}
	     */
	    Songo.prototype.shiftSort = function () {
	        this.sort.shift();
	        this.parse();
	        return this;
	    };
	    return Songo;
	}());
	function songo(entity) {
	    return new Songo(entity);
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = songo;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by axetroy on 16-9-16.
	 */
	"use strict";
	var default_1 = __webpack_require__(2);
	/**
	 * @class
	 * @classdesc Songo实例的内部对象，一般情况下，不要使用
	 * @property  string {string} 将meta转后成url后的字符串
	 * @property  _limit {number}
	 * @property  _page {number}
	 * @property  _skip {number}
	 * @returns {Query}
	 */
	var Meta = (function () {
	    function Meta(limit, page, skip) {
	        this.limit = limit;
	        this.page = page;
	        this.skip = skip;
	        this._limit = limit;
	        this._page = page;
	        this._skip = skip;
	    }
	    /**
	     * 覆盖原生方法
	     * @returns {string}
	     */
	    Meta.prototype.toString = function () {
	        return "_limit=" + this.limit + "&_page=" + this.page + "&_skip=" + this.skip;
	    };
	    /**
	     * 把一唯对象转换成json
	     * @param [replacer]  {replacer}    跟JSON.stringify(value,replacer,space)中的replacer一样
	     * @param [space]     {(number|null)} 跟JSON.stringify(value,replacer,space)中的space一样
	     * @returns {string}
	     */
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
	/**
	 * @const
	 * @type {{}}
	 */
	var DEFAULT_QUERY = {};
	exports.DEFAULT_QUERY = DEFAULT_QUERY;
	/**
	 * @type {string}
	 * @constant
	 */
	var DEFAULT_SORT = '';
	exports.DEFAULT_SORT = DEFAULT_SORT;
	/**
	 * @const
	 * @type {number}
	 */
	var DEFAULT_LIMIT = 10;
	exports.DEFAULT_LIMIT = DEFAULT_LIMIT;
	/**
	 * @const
	 * @type {number}
	 */
	var DEFAULT_PAGE = 0;
	exports.DEFAULT_PAGE = DEFAULT_PAGE;
	/**
	 * @const
	 * @type {number}
	 */
	var DEFAULT_SKIP = 0;
	exports.DEFAULT_SKIP = DEFAULT_SKIP;
	var DEFAULT_ENTITY = {
	    query: DEFAULT_QUERY,
	    sort: [],
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
	/**
	 * @class
	 * @classdesc Songo实例的内部对象，一般情况下，不要使用
	 * @property  string {string} 将meta转后成url后的字符串
	 * @returns {Query}
	 */
	var Sort = (function () {
	    /**
	     * @param sortArray {string[]}  字符串数组，按照顺序描述排序
	     */
	    function Sort(sortArray) {
	        var _this = this;
	        this.sortArray = sortArray;
	        if (Array.isArray(sortArray) && sortArray.length) {
	            sortArray.forEach(function (v, i) { return _this[i] = v; });
	        }
	    }
	    /**
	     * 把传进来的数组，使它正常化
	     * @returns {string}
	     */
	    Sort.prototype.normalize = function () {
	        return this.sortArray.map(function (v) { return v.replace(/^\+/, ''); }).join(',');
	    };
	    /**
	     * 覆盖原生方法
	     * @returns {string}
	     */
	    Sort.prototype.toString = function () {
	        return '_sort=' + this.normalize();
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
	    context["" + logicStr + key] = context["" + logicStr + key] || [];
	    context["" + logicStr + key].push('$' + compareOP + '$' + value);
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
	/**
	 * @class
	 * @classdesc Songo实例的内部对象，一般情况下，不要使用
	 * @property  string {string} 将query转后成url后的字符串
	 * @property  query {object}
	 * @property  object {object}
	 * @returns {Query}
	 */
	var Query = (function () {
	    /**
	     * @param queryObject {{string, (string|string[])}} 一个key-value的对象，没有对象嵌套
	     */
	    function Query(queryObject) {
	        this.queryObject = queryObject;
	        this.query = {};
	        this.object = {};
	        this.parse(queryObject);
	    }
	    /**
	     * 解析queryObject
	     * @param queryObject {{string, (string|string[])}} 一个key-value的对象，没有对象嵌套
	     */
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
	    /**
	     * JSON.stringify 's replacer
	     * @callback replacer
	     * @param key {string}
	     * @param value {string}
	     * @returns {*}
	     */
	    /**
	     * 把一唯对象转换成json
	     * @param [replacer]  {replacer}    跟JSON.stringify(value,replacer,space)中的replacer一样
	     * @param [space]     {(number|null)} 跟JSON.stringify(value,replacer,space)中的space一样
	     * @returns {string}
	     */
	    Query.prototype.toJson = function (replacer, space) {
	        return JSON.stringify(this.toObject(), replacer, space);
	    };
	    /**
	     * 把queryObject对象转换成一维对象
	     * @returns {{}}
	     */
	    Query.prototype.toObject = function () {
	        return this.object;
	    };
	    /**
	     * 将query转后成url后的字符串
	     * @returns {string}
	     */
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