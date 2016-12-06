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

declare function songo(entity?: Entity);

declare class Songo {
  new(entity: Entity): Songo;

  get string(): string;

  toString(): string;

  toQuery(): string;

  toParams(): Params;

  fromParams(paramsObject: Params): Songo;

  clearSort(): Songo;

  indexSort(sortKey: string): number;

  onlySort(sortKey: string): Songo;

  setSort(sortKey: string): Songo;

  unshiftSort(sortKey: string): Songo;

  removeSort(sortKey: string): Songo;

  pushSort(sortKey: string): Songo;

  popSort(): Songo;

  shiftSort(): Songo;
}

export = songo;