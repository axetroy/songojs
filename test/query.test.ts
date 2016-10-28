/**
 * Created by axetroy on 16-10-28.
 */

const expect = require('chai').expect;
import {queryParser} from '../src/queryParser';

describe('test query', function () {

  it('basic', function () {
    expect(!!queryParser).to.be.equal(true);

    expect(queryParser().toObject()).to.be.deep.equal({});

    expect(queryParser().string).to.be.a.string;
    expect(queryParser().string).to.be.equal('');
    expect(queryParser() + '').to.be.equal('');

  });

  it('复杂的query解析', function () {
    let query = {
      meta: {
        limit: 10,
        page: 0,
        skip: 0,
      },
      sort: [],
      $or$and$eq$currency: 'USD',
      $or$and$gt$money: 100,
      $or$and$ne$money: 200,
      $gt$money: '10',
      $eq$money: 300,
    };

    expect(queryParser(query).toObject()).to.be.deep.equal({
      $or$and$currency: ['$eq$USD'],
      $or$and$money: ['$gt$100', '$ne$200'],
      money: ['$eq$300', '$gt$10']
    });
  });

  it('复杂的query解析2', function () {
    let query = {
      $bt$money: [10, 200],
    };

    let result = queryParser(query);

    expect(result.toObject()).to.be.deep.equal({money: ['$bt$10,200']});
    expect(result.string).to.be.deep.equal('money=$bt$10,200');
  });

  it('复杂的query解析3', function () {
    let query = {
      $bt$money: [10, 200],
      $or$gt$level: 5
    };

    let result = queryParser(query);

    expect(result.toObject()).to.be.deep.equal({money: ['$bt$10,200'], $or$level: ['$gt$5']});
    expect(result.string).to.be.deep.equal('$or$level=$gt$5&money=$bt$10,200');
  })


});