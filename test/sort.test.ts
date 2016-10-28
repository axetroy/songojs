/**
 * Created by axetroy on 16-10-28.
 */

const expect = require('chai').expect;
import {sortParser} from '../src/sortParser';

describe('test sort', function () {

  it('basic', function () {
    expect(!!sortParser).to.be.equal(true);
    expect(sortParser() + '').to.be.equal('sort=');
  });

  it('正向排序自动去除+号', function () {
    expect(sortParser(['-created', '-money', '+level']) + '').to.be.equal('sort=-created,-money,level');
  });

  it('传入空数组，会获取默认值', function () {
    expect(sortParser([]) + '').to.be.equal('sort=');
  });


});