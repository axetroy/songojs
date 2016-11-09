/**
 * Created by axetroy on 16-9-16.
 */

/**
 *
 * @param operatorStr
 * @param value
 * @param context
 * @returns {any}
 */
function parse(operatorStr: string, value: string, context: any = {}) {
  if (value === void 0 || value === null || value === '') return;
  let operators = operatorStr.match(/((?=\$)?[^\$]+(?=\$))/ig);
  let logicOP: string[] = operators.length > 1 ? operators.slice(0, operators.length - 1) : [];       // 逻辑运算符
  let compareOP: string = operators[operators.length - 1];                                            // 比较运算符
  let key: string = operatorStr.match(/((?=\$)?\w+(?!=\$))$/i)[1];                                    // 查询key名

  let logicStr = logicOP.length ? '$' + logicOP.join('$') + '$' : '';

  context[`${logicStr}${key}`] = context[`${logicStr}${key}`] || [];

  context[`${logicStr}${key}`].push('$' + compareOP + '$' + value);

  return context;
}


function each(object, iterator): void {
  if (!object || !Object.keys(object)) return;
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      typeof iterator === 'function' && iterator.call(object, object[key], key, object);
    }
  }
}

function queryParser(queryObject: any = {}): any {
  return new Query(queryObject);
}

/**
 * @class
 * @classdesc Songo实例的内部对象，一般情况下，不要使用
 * @property  string {string} 将query转后成url后的字符串
 * @property  query {object}
 * @property  object {object}
 * @returns {Query}
 */
class Query {
  private query: any = {};
  private object: any = {};

  /**
   * @param queryObject {{string, (string|string[])}} 一个key-value的对象，没有对象嵌套
   */
  constructor(private queryObject: any) {
    this.parse(queryObject);
  }

  /**
   * 解析queryObject
   * @param queryObject {{string, (string|string[])}} 一个key-value的对象，没有对象嵌套
   */
  parse(queryObject): void {
    /**
     * 覆盖this.object对象
     * 保持 key = [value]   的形式
     */
    each(queryObject, (value: string, key: string)=> {
      if (!/^\$[^\$]{2}\$/.test(key)) return;
      parse(key, value, this.object);
    });

    /**
     * 覆盖this.query对象
     * 将this.object 转化为如下格式:
     * key = value1,value2,value3
     */
    each(this.object, (value: string[], key: string) => {
      this.query[key] = value.sort().join(',');
    });
  }

  get string(): string {
    return this.toString();
  }

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
  toJson(replacer?: any, space?: number | string): string {
    return JSON.stringify(this.toObject(), replacer, space);
  }

  /**
   * 把queryObject对象转换成一维对象
   * @returns {{}}
   */
  toObject(): any {
    return this.object;
  }

  /**
   * 将query转后成url后的字符串
   * @returns {string}
   */
  toString(): string {
    let arr: string[] = [];
    each(this.query, function (value: string, key: string) {
      arr.push(key + '=' + value);
    });
    arr.sort();
    return arr.join('&');
  }
}

export {queryParser};