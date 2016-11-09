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

/**
 * 字符串转码
 * @param encodeString {string} 要转码的字符串
 * @returns {string}
 */
function encode(encodeString: string): string {
  return GLOBAL.btoa ? GLOBAL.btoa(encodeString) : encodeURIComponent(encodeString)
}

/**
 * 字符串解码，并且还原为object
 * @param decodeString  {string}
 * @returns {{}}
 */
function decode(decodeString: string): any {
  decodeString = decodeURIComponent(decodeString);
  let result = {};
  try {
    result = JSON.parse(decodeString);
  } catch (e) {
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
class Songo {

  public meta: Meta;
  public sort: string[];
  public query: any;

  public Meta: any;
  public Sort: any;
  public Query: any;

  /**
   * @param [entity=object.<>] {{query:object,sort:string[],meta:object<string,number>}}
   *    实例化Songo类的参数，包含3个字段:[query,sort,meta]
   * @returns{Songo}
   */
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

  /**
   * @private
   */
  private parse() {
    this.Meta = metaParser(this.meta);
    this.Sort = sortParser(this.sort);
    this.Query = queryParser(this.query)
  }

  /**
   * 获取转换的url字符串
   * @readonly
   * @returns {string}
   */
  public get string(): string {
    return this.toString();
  }

  /**
   * toString方法的别名
   * @example
   *    let songo = new Songo();
   *    songo.toQuery()
   * @returns {string}
   */
  public toQuery(): string {
    return this.toString();
  }

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
   * @override
   * @this Songo
   * @returns {string}
   */
  public toString(): string {
    this.parse();
    return [this.Meta, this.Sort, this.Query]
      .filter(v=>v + '')
      .join('&');
  }

  /**
   * 清空排序队列
   * @example
   *    let songo = new Songo({sort:['-create']});
   *    songo.clearSort();
   * @returns {Songo}
   */
  public clearSort(): Songo {
    this.sort = [];
    this.parse();
    return this;
  }

  /**
   * 索引一个sortKey
   * @param sortKey {string}  排序key，例如"+created","-created";默认+可以不填
   * @example
   *    let songo = new Songo({sort:['-create']});
   *    songo.indexSort('created');   // 0
   * @returns {number}
   */
  public indexSort(sortKey: string): number {
    return this.sort.map(v=>v.replace(/^[\-\+]/, '')).indexOf(sortKey.replace(/^[\-\+]/, ''));
  }

  /**
   * 仅仅按照一个key排序
   * @param sortKey
   * @example
   *    let songo = new Songo({sort:['-create']});
   *    songo.onlySort('-money');
   *    console.log(songo.sort);    // ['-money']
   * @returns {Songo}
   */
  public onlySort(sortKey: string): Songo {
    this.sort = [sortKey];
    this.parse();
    return this;
  }

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
  unshiftSort(sortKey: string): Songo {
    let index = this.indexSort(sortKey);
    // check the attr exist or not
    if (index >= 0) this.sort.splice(index, 1);
    this.sort.unshift(sortKey);
    this.parse();
    return this;
  }

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
  removeSort(sortKey: string): Songo {
    let index = this.indexSort(sortKey);
    if (index >= 0) this.sort.splice(index, 1);
    this.parse();
    return this;
  }

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
  pushSort(sortKey: string): Songo {
    let index = this.indexSort(sortKey);
    // check the attr exist or not
    if (index >= 0) this.sort.splice(index, 1);
    this.sort.push(sortKey);
    this.parse();
    return this;
  }

  /**
   * 删除队列的最后一个,，类似Array.prototype.pop，但是不会返回被删除的对象
   * @example
   *    let songo = new Songo({sort:['money','level','created']});
   *    songo.popSort();        // songo.sort >>  ['money','level']
   *    songo.popSort();        // songo.sort >>  ['money']
   *    songo.popSort();        // songo.sort >>  []
   * @returns {Songo}
   */
  popSort(): Songo {
    this.sort.pop();
    this.parse();
    return this;
  }

  /**
   * 除队列的第一个，类似Array.prototype.shift，但是不会返回被删除的对象
   * @example
   *    let songo = new Songo({sort:['money','level','created']});
   *    songo.shiftSort();        // songo.sort >>  ['level','created']
   *    songo.shiftSort();        // songo.sort >>  ['created']
   *    songo.shiftSort();        // songo.sort >>  []
   * @returns {Songo}
   */
  shiftSort(): Songo {
    this.sort.shift();
    this.parse();
    return this;
  }


}

export default function songo(entity?: Entity): Songo {
  return new Songo(entity);
}