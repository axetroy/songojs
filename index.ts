import {metaParser} from './src/metaParser';
import {sortParser} from './src/sortParser';
import {queryParser} from './src/queryParser';
import {DEFAULT_ENTITY, DEFAULT_PAGE, DEFAULT_LIMIT, DEFAULT_SKIP} from './src/default';

const GLOBAL = this;

interface Meta {
  limit?: number,
  page?: number,
  skip?: number
}

interface Entity {
  query?: any,
  sort?: string[],
  meta?: Meta
}

interface Params {
  limit: number,
  page: number,
  skip?: number,
  sort?: string,
  query?: string
}

function encode(encodeString: string): string {
  return GLOBAL.btoa ? GLOBAL.btoa(encodeString) : encodeURIComponent(encodeString)
}

function decode(decodeString: string): any {
  decodeString = decodeURIComponent(decodeString);
  let result;
  try {
    result = JSON.parse(decodeString);
  } catch (e) {
    result = {};
  }
  return result;
}

class Songo {

  public meta: Meta;
  public sort: string[];
  public query: any;

  public Meta: any;
  public Sort: any;
  public Query: any;

  constructor(entity: Entity = DEFAULT_ENTITY) {
    // make sure attr has been set
    entity.meta = entity.meta || {};
    entity.sort = entity.sort || [];
    entity.query = entity.query || {};

    // set the default value
    entity.meta.page = entity.meta.page !== void 0 ? entity.meta.page : DEFAULT_PAGE;
    entity.meta.limit = entity.meta.limit !== void 0 ? entity.meta.limit : DEFAULT_LIMIT;
    entity.meta.skip = entity.meta.skip !== void 0 ? entity.meta.skip : DEFAULT_SKIP;

    this.meta = entity.meta;
    this.sort = entity.sort;
    this.query = entity.query;
    this.parse();
  }

  private parse() {
    this.Meta = metaParser(this.meta);
    this.Sort = sortParser(this.sort);
    this.Query = queryParser(this.query)
  }

  public get string(): string {
    return this.toString();
  }

  public toQuery(): string {
    return this.toString();
  }

  /**
   *  转换成适合在url上防止的对象
   */
  public toParams(): Params {
    this.parse();
    return {
      limit: this.Meta.limit,
      page: this.Meta.page,
      skip: this.Meta.skip,
      sort: this.Sort.normalize(),
      query: encode(JSON.stringify(this.query))         // base64加密 || 转码
    }
  }

  /**
   * 将一个params对象，转化为实例
   * @param paramsObject
   * @returns {Songo}
   */
  public fromParams(paramsObject: Params): Songo {
    let {limit, page, skip, sort, query} = paramsObject;
    if (limit !== void 0) this.meta.limit = limit;
    if (page !== void 0) this.meta.page = page;
    if (skip !== void 0) this.meta.skip = skip;
    if (sort !== void 0) this.sort = typeof sort === 'string' ? sort.split(',') : Array.isArray(sort) ? sort : [];
    if (query !== void 0) this.query = decode(query);   // base64解密 || 转码
    return this;
  }

  /**
   * 转换成最终的url字符串
   * @returns {string}
   */
  public toString(): string {
    this.parse();
    return [this.Meta, this.Sort, this.Query]
      .filter(v=>v + '')
      .join('&');
  }

  public clearSort(): Songo {
    this.sort = [];
    this.parse();
    return this;
  }

  private indexSort(sortKey: string): number {
    return this.sort.map(v=>v.replace(/^[\-\+]/, '')).indexOf(sortKey.replace(/^[\-\+]/, ''));
  }

  /**
   * 仅仅按照一个key排序
   * @param sortKey
   * @returns {Songo}
   */
  public onlySort(sortKey: string): Songo {
    this.sort = [sortKey];
    this.parse();
    return this;
  }

  /**
   * 添加一个sort
   * @param sortKey
   */
  public setSort(sortKey: string): Songo {
    let index = this.indexSort(sortKey);
    // check the attr exist or not
    if (index >= 0) {
      this.sort.splice(index, 1);
      this.unshiftSort(sortKey);
    } else {
      this.unshiftSort(sortKey);
    }
    this.parse();
    return this;
  }

  unshiftSort(sortKey: string): Songo {
    let index = this.indexSort(sortKey);
    // check the attr exist or not
    if (index >= 0) this.sort.splice(index, 1);
    this.sort.unshift(sortKey);
    this.parse();
    return this;
  }

  removeSort(sortKey: string): Songo {
    let index = this.indexSort(sortKey);
    if (index >= 0) this.sort.splice(index, 1);
    this.parse();
    return this;
  }

  pushSort(sortKey: string): Songo {
    let index = this.indexSort(sortKey);
    // check the attr exist or not
    if (index >= 0) this.sort.splice(index, 1);
    this.sort.push(sortKey);
    this.parse();
    return this;
  }

  popSort(): Songo {
    this.sort.pop();
    this.parse();
    return this;
  }

  shiftSort(): Songo {
    this.sort.shift();
    this.parse();
    return this;
  }


}

export default function songo(entity?: Entity): Songo {
  return new Songo(entity);
}