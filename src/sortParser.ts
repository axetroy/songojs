/**
 * Created by axetroy on 16-9-16.
 */

import {DEFAULT_SORT} from './default';

function sortParser(sort: string[] = [DEFAULT_SORT]) {
  sort = sort.length ? sort : [DEFAULT_SORT];
  return new Sort(sort)
}

class Sort {
  constructor(private sortArray: string[]) {

  }

  toString() {
    return this.sortArray.map(v=>v.replace(/^\+/, '')).join(',');
  }

}

export {sortParser};