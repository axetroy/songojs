/**
 * Created by axetroy on 16-9-16.
 */

import {DEFAULT_SORT} from './default';

function sortParser(sort: string[] = []) {
  sort = sort.length ? sort : [];
  return new Sort(sort)
}

class Sort {
  constructor(private sortArray: string[]) {
    if (Array.isArray(sortArray) && sortArray.length) {
      sortArray.forEach((v, i)=> this[i] = v);
    }
  }

  normalize(): string {
    return this.sortArray.map(v=>v.replace(/^\+/, '')).join(',');
  }

  toString() {
    return 'sort=' + this.normalize();
  }

}

export {sortParser};