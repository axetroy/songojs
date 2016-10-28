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

class Query {
  private query: any = {};
  private object: any = {};

  constructor(private queryObject: any) {
    this.parse(queryObject);
  }

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

  toJson(replacer?: any, space?: number | string): string {
    return JSON.stringify(this.toObject(), replacer, space);
  }

  toObject(): any {
    return this.object;
  }

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