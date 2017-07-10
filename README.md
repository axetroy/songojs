# songo.js

[![Greenkeeper badge](https://badges.greenkeeper.io/axetroy/songojs.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/axetroy/songojs.svg?branch=master)](https://travis-ci.org/axetroy/songojs)![Coverage Status](https://coveralls.io/repos/github/axetroy/songojs/badge.svg?branch=master)[![Dependency](https://david-dm.org/axetroy/songojs.svg)](https://david-dm.org/axetroy/songojs)

### Description

用于配合songo协议的前端js库

参考: [https://github.com/suboat/songo](https://github.com/suboat/songo)

### Usage

```bash
npm install https://github.com/axetroy/songojs.git --save
```

```javascript
const songo = require('songo')
// or
import songo from 'songo';
```

### [Documentation](https://axetroy.github.io/songojs)

#### songo(entity?: Entity):Songo

```typescript

interface Entity {
  query?: any,
  sort?: string[],
  meta?: {
      limit?:number,
      page?: number,
      skip?: number
  }
}
```

默认的entity:

```typescript
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
})
```

可以只设置部分值，其他为默认值

```typescript
describe('test songo partial entity',function() {
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
});
```

#### Songo.meta:Meta

```typescript
interface Meta {
  limit?: number,
  page?: number,
  skip?: number
}
```

#### Songo.sort:string[]

#### Songo.query:any

> 可直接操作值，覆盖，删除，在转换url的时候，再次编译。

> 通过key无限层级，没有嵌套，意味着可以直接在view层使用

> 意味着这种用法，是安全的: **so.query.$and$or$eq$currency = 'USD'**;

```typescript
describe('test songo partial entity',function() {
  it('修改meta属性后，重新生成', function () {
    var so = songo({
      meta: {limit: 10},
      sort: ['-created']
    });
    expect(so.meta.limit).to.be.equal(10);
    so.meta.limit = 50;
    expect(so + '').to.be.equal('_limit=50&_page=0&_skip=0&_sort=-created')
  });
});
```

#### Songo.toString():string

> 将对象转换成符合songo协议的url的字符串，用于前后端的数据交互

> 可以通过**so + ''**来自动触发toString方法

```typescript
describe('test songo partial entity',function() {
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
  })
});
```

#### Songo.string:string

> 等同于Songo.toString()

```typescript
describe('test songo partial entity',function() {
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
  })
});
```

#### Songo.toQuery():string

> Songo.string()的别名

#### Songo.toParams():Params

> 将对象转换成适合放在url上的object对象，用于前端页面，而非前后端的数据交互

```typescript
interface Params {
  limit: number,
  page: number,
  skip?: number,
  sort?: string,
  query?: string
}
```

#### Songo.fromParams(paramsObject:Params):Songo

> 将Songo.toParams生成的对象，还原为Songo对象

> 用于从url读取query，然后还原

```typescript
interface Params {
  limit: number,
  page: number,
  skip?: number,
  sort?: string,
  query?: string
}
```

```typescript
describe('test params parser',function() {
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
  })  
});
```

#### Songo.clearSort():Songo

> 清除排序sort字段为空数组

#### Songo.onlySort(sortKey: string):Songo

> 设置一个唯一的sort排序字段

```typescript
describe('test only sort method',function() {
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
})
```

#### Songo.setSort(sortKey: string):Songo

> 添加一个sort排序字段，如果已存在的字段，则删除旧字段，把新字段放在数组的第一个

```typescript
describe('test only sort method',function() {
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
})
```

#### Songo.unshiftSort(sortKey: string):Songo

> 目前，效果等同于Songo.setSort()

```typescript
describe('test only sort method',function() {
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
})
```

#### Songo.removeSort(sortKey:string):Songo

> 删除某个排序字段

```typescript
describe('test only sort method',function() {
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
})
```

#### Songo.pushSort(sortKey:string):Songo

> 等同于Array.push()

```typescript
describe('test only sort method',function() {
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
})
```

#### Songo.popSort(sortKey:string):Songo

> 等同于Array.pop()

```typescript
describe('test only sort method',function() {
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
})
```

#### Songo.shiftSort(sortKey:string):Songo

> 等同于Array.shiftSort()

```typescript
describe('test only sort method',function() {
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
})
```

### Contribution

```bash
git clone https://github.com/axetroy/songojs.git
cd songojs
npm install gulp-cli -g
npm install mocha -g
npm install 

npm run build
```

### Test

```bash
npm run test
// or
npm run test:watch
```

test detail:

[https://travis-ci.org/axetroy/songojs](https://travis-ci.org/axetroy/songojs)

### License

The MIT License (MIT)

Copyright (c) 2016 axetroy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
