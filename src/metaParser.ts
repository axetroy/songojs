/**
 * Created by axetroy on 16-9-16.
 */

import {DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SKIP} from './default';

interface MetaParams {
  limit?: number,
  page?: number,
  skip?: number
}

interface MetaJson {
  _limit: number,
  _page: number,
  _skip: number
}

/**
 * @class
 * @classdesc Songo实例的内部对象，一般情况下，不要使用
 * @property  string {string} 将meta转后成url后的字符串
 * @property  _limit {number}
 * @property  _page {number}
 * @property  _skip {number}
 * @returns {Query}
 */
class Meta {
  public _limit: number;
  public _page: number;
  public _skip: number;

  constructor(private limit: number, private page: number, private skip: number) {
    this._limit = limit;
    this._page = page;
    this._skip = skip;
  }

  /**
   * 覆盖原生方法
   * @returns {string}
   */
  toString(): string {
    return `_limit=${this.limit}&_page=${this.page}&_skip=${this.skip}`;
  }

  /**
   * 把一唯对象转换成json
   * @param [replacer]  {replacer}    跟JSON.stringify(value,replacer,space)中的replacer一样
   * @param [space]     {(number|null)} 跟JSON.stringify(value,replacer,space)中的space一样
   * @returns {string}
   */
  toJson(replacer?: any, space?: number | string): string {
    return JSON.stringify(this.toObject(), replacer, space);
  }

  toObject(): MetaJson {
    return {
      _limit: this._limit,
      _page: this._page,
      _skip: this._skip
    }
  }

}

function metaParser(meta: MetaParams = {
  limit: DEFAULT_LIMIT,
  page: DEFAULT_PAGE,
  skip: DEFAULT_SKIP
}) {
  const limit: number = meta.limit as number || DEFAULT_LIMIT as number;
  const page: number = meta.page as number || DEFAULT_PAGE as number;
  const skip: number = meta.skip as number || DEFAULT_SKIP as number;
  return new Meta(limit, page, skip);
}

export {metaParser};