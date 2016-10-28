/**
 * Created by axetroy on 16-10-28.
 */

const expect = require('chai').expect;
import songo from '../index';

describe('test songo', function () {

  it('default entity', function () {
    var so = songo();
    expect(so.meta).to.be.deep.equal({
      limit: 10,
      page: 0,
      skip: 0
    });
    expect(so.sort).to.be.deep.equal([]);
    expect(so.query).to.be.deep.equal({});
  });

  it('basic', function () {
    var so = songo({
      meta: {limit: 10},
      query: {
        $eq$currency: 'USD',
        $or$gt$money: 200
      },
      sort: ['-created'],
    });
    expect(so.meta.limit).to.be.equal(10);
    expect(so.meta.page).to.be.equal(0);
    expect(so.meta.skip).to.be.equal(0);
    expect(so.sort).to.be.deep.equal(['-created']);
  });

  it('修改meta属性后，重新生成', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created']
    });
    expect(so.meta.limit).to.be.equal(10);
    so.meta.limit = 50;
    expect(so + '').to.be.equal('_limit=50&_page=0&_skip=0&_sort=-created')
  });

  it('设置query中的属性为undefined', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created'],
      query: {
        $eq$currency: 'USD'
      }
    });
    expect(so + '').to.be.equal('_limit=10&_page=0&_skip=0&_sort=-created&currency=$eq$USD');
    so.query.$eq$currency = void 0;
    expect(so + '').to.be.equal('_limit=10&_page=0&_skip=0&_sort=-created');
  });

  it('设置query中的属性为null', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created'],
      query: {
        $eq$currency: 'USD'
      }
    });
    expect(so + '').to.be.equal('_limit=10&_page=0&_skip=0&_sort=-created&currency=$eq$USD');
    so.query.$eq$currency = null;
    expect(so + '').to.be.equal('_limit=10&_page=0&_skip=0&_sort=-created');
  });

  it('设置query中的属性为空字符串', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created'],
      query: {
        $eq$currency: 'USD'
      }
    });
    expect(so + '').to.be.equal('_limit=10&_page=0&_skip=0&_sort=-created&currency=$eq$USD');
    so.query.$eq$currency = '';
    expect(so + '').to.be.equal('_limit=10&_page=0&_skip=0&_sort=-created');
  });

  it('不设置排序的情况下,为空数组', function () {
    var so = songo({
      meta: {limit: 10}
    });
    expect(so.sort).to.be.deep.equal([]);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=');
  });

  it('只设置部分值,其余值应为默认值', function () {
    var so = songo({
      meta: {limit: 10}
    });
    expect(so.meta).to.be.deep.equal({
      limit: 10,
      page: 0,
      skip: 0
    });
    expect(so.sort).to.be.deep.equal([]);
    expect(so.query).to.be.deep.equal({});
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=');
  });

  it('toParams 和 fromParams转码一致', function () {
    var so = songo({
      meta: {
        limit: 20,
        page: 2,
        skip: 0
      },
      sort: ['money'],
      query: {
        $eq$fid: '000',
        $gt$money: 100,
        $lg$money: 1000
      }
    });
    expect(so.toParams()).to.be.deep.equal(so.fromParams(so.toParams()).toParams())
  });

  it('test toString method', function () {
    var so = songo({
      meta: {
        limit: 20,
        page: 2,
        skip: 0
      },
      sort: ['money'],
      query: {
        $eq$fid: '000',
        $gt$money: 100,
        $lg$money: 1000
      }
    });
    expect(so.toString()).to.be.deep.equal(so + '');
    expect(so.toString()).to.be.deep.equal('_limit=20&_page=2&_skip=0&_sort=money&fid=$eq$000&money=$gt$100,$lg$1000')
  });

  it('test string property', function () {
    var so = songo({
      meta: {
        limit: 20,
        page: 2,
        skip: 0
      },
      sort: ['money'],
      query: {
        $eq$fid: '000',
        $gt$money: 100,
        $lg$money: 1000
      }
    });
    expect(so.string).to.be.deep.equal(so + '');
    expect(so.string).to.be.deep.equal(so.toString());
    expect(so.string).to.be.deep.equal('_limit=20&_page=2&_skip=0&_sort=money&fid=$eq$000&money=$gt$100,$lg$1000')
  });

});

describe('test songo sort method', function () {
  it('only sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-money']
    });
    expect(so.sort).to.be.deep.equal(['-money']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=-money');

    so.onlySort('created');
    expect(so.sort).to.be.deep.equal(['created']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=created');

    so.onlySort('-level');
    expect(so.sort).to.be.deep.equal(['-level']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=-level');
  });

  it('set sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-money']
    });
    expect(so.sort).to.be.deep.equal(['-money']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=-money');

    so.setSort('created');

    expect(so.sort).to.be.deep.equal(['created', '-money']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=created,-money');

    so.setSort('money');

    expect(so.sort).to.be.deep.equal(['money', 'created']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=money,created');

  });

  it('clear sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-money']
    });
    expect(so.sort).to.be.deep.equal(['-money']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=-money');
    so.clearSort();
    expect(so.sort).to.be.deep.equal([]);
    expect(so.sort.length).to.be.deep.equal(0);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=');
  });

  it('unshift sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created', 'status']
    });
    expect(so.sort).to.be.deep.equal(['-created', 'status']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=-created,status');
    so.unshiftSort('money');
    expect(so.sort).to.be.deep.equal(['money', '-created', 'status']);
    expect(so.sort.length).to.be.deep.equal(3);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=money,-created,status');
  });

  it('remove sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created', 'status']
    });
    expect(so.sort).to.be.deep.equal(['-created', 'status']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=-created,status');
    so.removeSort('status');
    expect(so.sort).to.be.deep.equal(['-created']);
    expect(so.sort.length).to.be.deep.equal(1);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=-created');
  });

  it('push sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created', 'status']
    });
    expect(so.sort).to.be.deep.equal(['-created', 'status']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=-created,status');
    so.pushSort('level');
    expect(so.sort).to.be.deep.equal(['-created', 'status', 'level']);
    expect(so.sort.length).to.be.deep.equal(3);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=-created,status,level');
  });

  it('pop sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created', 'status']
    });
    expect(so.sort).to.be.deep.equal(['-created', 'status']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=-created,status');
    so.popSort();
    expect(so.sort).to.be.deep.equal(['-created']);
    expect(so.sort.length).to.be.deep.equal(1);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=-created');
  });

  it('shift sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created', 'status']
    });
    expect(so.sort).to.be.deep.equal(['-created', 'status']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=-created,status');
    so.shiftSort();
    expect(so.sort).to.be.deep.equal(['status']);
    expect(so.sort.length).to.be.deep.equal(1);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&_sort=status');
  });
});