/**
 * Created by axetroy on 16-10-28.
 */

const expect = require('chai').expect;
import {queryParser} from '../src/queryParser';

describe('test query', function () {

  it('basic', function () {
    expect(!!queryParser).to.be.equal(true);

    expect(queryParser()).to.be.deep.equal({});

    console.log(queryParser({
      $eq$currency: 111
    }));

  })

});