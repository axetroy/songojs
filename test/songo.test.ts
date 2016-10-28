/**
 * Created by axetroy on 16-10-28.
 */

const expect = require('chai').expect;
import songo from '../index';

describe('test songo', function () {
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
    expect(so + '').to.be.equal('_limit=50&_page=0&_skip=0&sort=-created')
  });

  it('设置query中的属性为undefined', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created'],
      query: {
        $eq$currency: 'USD'
      }
    });
    expect(so + '').to.be.equal('_limit=10&_page=0&_skip=0&sort=-created&currency=$eq$USD');
    so.query.$eq$currency = void 0;
    expect(so + '').to.be.equal('_limit=10&_page=0&_skip=0&sort=-created');
  });

  it('设置query中的属性为null', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created'],
      query: {
        $eq$currency: 'USD'
      }
    });
    expect(so + '').to.be.equal('_limit=10&_page=0&_skip=0&sort=-created&currency=$eq$USD');
    so.query.$eq$currency = null;
    expect(so + '').to.be.equal('_limit=10&_page=0&_skip=0&sort=-created');
  });

  it('设置query中的属性为空字符串', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created'],
      query: {
        $eq$currency: 'USD'
      }
    });
    expect(so + '').to.be.equal('_limit=10&_page=0&_skip=0&sort=-created&currency=$eq$USD');
    so.query.$eq$currency = '';
    expect(so + '').to.be.equal('_limit=10&_page=0&_skip=0&sort=-created');
  });

  it('不设置排序的情况下,为空数组', function () {
    var so = songo({
      meta: {limit: 10}
    });
    expect(so.sort).to.be.deep.equal([]);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=');
  });

  it('only sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-money']
    });
    expect(so.sort).to.be.deep.equal(['-money']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=-money');

    so.onlySort('created');
    expect(so.sort).to.be.deep.equal(['created']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=created');

    so.onlySort('-level');
    expect(so.sort).to.be.deep.equal(['-level']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=-level');
  });

  it('set sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-money']
    });
    expect(so.sort).to.be.deep.equal(['-money']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=-money');

    so.setSort('created');

    expect(so.sort).to.be.deep.equal(['created', '-money']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=created,-money');

    so.setSort('money');

    expect(so.sort).to.be.deep.equal(['money', 'created']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=money,created');

  });

  it('clear sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-money']
    });
    expect(so.sort).to.be.deep.equal(['-money']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=-money');
    so.clearSort();
    expect(so.sort).to.be.deep.equal([]);
    expect(so.sort.length).to.be.deep.equal(0);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=');
  });

  it('unshift sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created', 'status']
    });
    expect(so.sort).to.be.deep.equal(['-created', 'status']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=-created,status');
    so.unshiftSort('money');
    expect(so.sort).to.be.deep.equal(['money', '-created', 'status']);
    expect(so.sort.length).to.be.deep.equal(3);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=money,-created,status');
  });

  it('remove sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created', 'status']
    });
    expect(so.sort).to.be.deep.equal(['-created', 'status']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=-created,status');
    so.removeSort('status');
    expect(so.sort).to.be.deep.equal(['-created']);
    expect(so.sort.length).to.be.deep.equal(1);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=-created');
  });

  it('push sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created', 'status']
    });
    expect(so.sort).to.be.deep.equal(['-created', 'status']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=-created,status');
    so.pushSort('level');
    expect(so.sort).to.be.deep.equal(['-created', 'status', 'level']);
    expect(so.sort.length).to.be.deep.equal(3);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=-created,status,level');
  });

  it('pop sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created', 'status']
    });
    expect(so.sort).to.be.deep.equal(['-created', 'status']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=-created,status');
    so.popSort();
    expect(so.sort).to.be.deep.equal(['-created']);
    expect(so.sort.length).to.be.deep.equal(1);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=-created');
  });

  it('shift sort', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created', 'status']
    });
    expect(so.sort).to.be.deep.equal(['-created', 'status']);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=-created,status');
    so.shiftSort();
    expect(so.sort).to.be.deep.equal(['status']);
    expect(so.sort.length).to.be.deep.equal(1);
    expect(so + '').to.be.deep.equal('_limit=10&_page=0&_skip=0&sort=status');
  });

});