import {metaParser} from './src/metaParser';
import {sortParser} from './src/sortParser';
import {queryParser} from './src/queryParser';

export default function () {

}

function songo(any: any) {
}

songo({
  limit: 10,
  page: 0,
  skip: 0,
  sort: ['-created'],
  query: {
    currency: '$eq$USD'
  }
});

var s = '?_limit=10&_page=0&_skip=0&sort=-created&$and$currency=$eq$USD';