# osb-computing-service [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> 

## Installation

```sh
$ npm install --save osb-computing-service
```

## Test
```sh
$ npm test
```

or

```sh
$ mocha test/logic-filter.js
```

## Usage

```js
var osbComputingService = require('osb-computing-service');

var userdata = {
  'rs1234': true,
  'rs10': true,
  'rs11': true
};

var testCase = {expression: 'and(rs1234, rs9)', shouldBe: false};
var filter = new osbComputingService.LogicFilter();
filter.compile(testCase.expression);

var resolver = function (value) {
  return !!userdata[value];
};

var result = filter.execute(resolver) == testCase.shouldBe;

```
## License

Apache-2.0 © [gorebill @OSB Team]()


[npm-image]: https://badge.fury.io/js/osb-computing-service.svg
[npm-url]: https://npmjs.org/package/osb-computing-service
[travis-image]: https://travis-ci.org/gorebill@163.com/osb-computing-service.svg?branch=master
[travis-url]: https://travis-ci.org/gorebill@163.com/osb-computing-service
[daviddm-image]: https://david-dm.org/gorebill@163.com/osb-computing-service.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/gorebill@163.com/osb-computing-service




## Reference
 
https://github.com/yeoman/generator-node

https://babeljs.io/docs/learn-es2015/

http://eslint.org/docs/rules

http://eslint.org/docs/user-guide/configuring#configuring-rules











