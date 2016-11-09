/**
 * Created by axetroy on 16-9-16.
 */

import {DEFAULT_SORT} from './default';

function sortParser(sort: string[] = []) {
  sort = sort.length ? sort : [];
  return new Sort(sort)
}

/**
 * @class
 * @classdesc Songo实例的内部对象，一般情况下，不要使用
 * @property  string {string} 将meta转后成url后的字符串
 * @returns {Query}
 */
class Sort {
  /**
   * @param sortArray {string[]}  字符串数组，按照顺序描述排序
   */
  constructor(private sortArray: string[]) {
    if (Array.isArray(sortArray) && sortArray.length) {
      sortArray.forEach((v, i)=> this[i] = v);
    }
  }

  /**
   * 把传进来的数组，使它正常化
   * @returns {string}
   */
  normalize(): string {
    return this.sortArray.map(v=>v.replace(/^\+/, '')).join(',');
  }

  /**
   * 覆盖原生方法
   * @returns {string}
   */
  toString() {
    return '_sort=' + this.normalize();
  }

}

export {sortParser};