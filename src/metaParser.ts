/**
 * Created by axetroy on 16-9-16.
 */

import {DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SKIP} from './default';

interface MetaParams {
  limit: number,
  page: number,
  skip: number
}

interface MetaJson {
  _limit: number,
  _page: number,
  _skip: number
}


class Meta {
  public _limit: number;
  public _page: number;
  public _skip: number;

  constructor(private limit: number, private page: number, private skip: number) {
    this._limit = limit;
    this._page = page;
    this._skip = skip;
  }

  toString(): string {
    return `_limit=${this.limit}&_page=${this.page}&_skip=${this.skip}`;
  }

  toJson(): string {
    return JSON.stringify(this.toObject());
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
  const limit: number = meta.page as number || DEFAULT_LIMIT as number;
  const page: number = meta.page as number || DEFAULT_PAGE as number;
  const skip: number = meta.page as number || DEFAULT_PAGE as number;
  return new Meta(limit, page, skip);
}

export {metaParser};