# songo.js [![Build Status](https://travis-ci.org/axetroy/songojs.svg?branch=master)](https://travis-ci.org/axetroy/songojs)![Coverage Status](https://coveralls.io/repos/github/axetroy/songojs/badge.svg?branch=master)[![Dependency](https://david-dm.org/axetroy/songojs.svg)](https://david-dm.org/axetroy/songojs)

### Descriptiondd

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

### Documentation

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

#### Songo.toString():string

> 将对象转换成符合songo协议的url的字符串，用于前后端的数据交互

#### Songo.string:string

> 等同于Songo.toString()

#### Songo.toQuery():string

> Songo.string()的别名

#### Songo.toParams():Params

> 将对象转换成适合放在url上的object对象，用于前端页面，而非前后的通信

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

```typescript
interface Params {
  limit: number,
  page: number,
  skip?: number,
  sort?: string,
  query?: string
}
```

#### Songo.clearSort():Songo

> 清除排序sort字段为空数组

#### Songo.onlySort(sortKey: string):Songo

> 设置一个唯一的sort排序字段

#### Songo.setSort(sortKey: string):Songo

> 添加一个sort排序字段，如果已存在的字段，则删除旧字段，把新字段放在数组的第一个

#### Songo.unshiftSort(sortKey: string):Songo

> 目前，效果等同于Songo.setSort()

#### Songo.removeSort(sortKey:string):Songo

> 删除某个排序字段

#### Songo.pushSort(sortKey:string):Songo

> 等同于Array.push()

#### Songo.popSort(sortKey:string):Songo

> 等同于Array.pop()

#### Songo.shiftSort(sortKey:string):Songo

> 等同于Array.shiftSort()


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
