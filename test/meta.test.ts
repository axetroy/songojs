const expect = require('chai').expect;
import {metaParser} from '../src/metaParser';

describe('test meta', function (): void {

  it('basic', function () {
    let meta = metaParser();
    expect(!!meta).to.be.equal(true);
    expect(meta.toString()).to.be.equal('_limit=10&_page=0&_skip=0');
    expect(meta + '').to.be.equal('_limit=10&_page=0&_skip=0');
    expect(metaParser().toObject()).to.be.deep.equal({
      _limit: 10,
      _page: 0,
      _skip: 0
    });

    expect(metaParser().toJson()).to.be.a.string;
  });

  it('set meta info', function () {
    let meta = metaParser({
      limit: 30,
      page: 2,
      skip: 0
    });

    expect(meta.toJson()).to.be.a.string;
    expect(meta.toJson()).to.be.equal('{"_limit":30,"_page":2,"_skip":0}');
    expect(meta.toString()).to.be.equal('_limit=30&_page=2&_skip=0');
    expect(meta + '').to.be.equal('_limit=30&_page=2&_skip=0');
    expect(meta.toObject()).to.be.deep.equal({
      _limit: 30,
      _page: 2,
      _skip: 0
    });

  });

  it('只设置一个meta信息', function () {
    let meta = metaParser({
      limit: 50,
    });
    expect(meta.toJson()).to.be.a.string;
    expect(meta.toJson()).to.be.equal('{"_limit":50,"_page":0,"_skip":0}');
    expect(meta.toString()).to.be.equal('_limit=50&_page=0&_skip=0');
    expect(meta + '').to.be.equal('_limit=50&_page=0&_skip=0');
    expect(meta.toObject()).to.be.deep.equal({
      _limit: 50,
      _page: 0,
      _skip: 0
    });
  });

  it('只设置一个meta信息2', function () {
    let meta = metaParser({
      limit: 50,
      skip: 20
    });
    expect(meta.toJson()).to.be.a.string;
    expect(meta.toJson()).to.be.equal('{"_limit":50,"_page":0,"_skip":20}');
    expect(meta.toString()).to.be.equal('_limit=50&_page=0&_skip=20');
    expect(meta + '').to.be.equal('_limit=50&_page=0&_skip=20');
    expect(meta.toObject()).to.be.deep.equal({
      _limit: 50,
      _page: 0,
      _skip: 20
    });
  })


});