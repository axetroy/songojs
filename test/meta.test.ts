const expect = require('chai').expect;
import {metaParser} from '../src/metaParser';

describe('test meta', function (): void {

  it('basic', function () {
    expect(!!metaParser).to.be.equal(true);
    expect(metaParser() + '').to.be.equal('_limit=10&_page=0&_skip=0');
    expect(metaParser().toObject()).to.be.deep.equal({
      _limit: 10,
      _page: 0,
      _skip: 0
    });

    expect(metaParser().toJson()).to.be.a.string;
  })

});