import assert from 'assert';
import LogicFilter from '../lib/logic-filter';

import util from 'util';

describe('logic-filter', function () {
  it('LogicFilter unit test', function () {
    var userdata = {
      'rs1234': true,
      'rs10': true,
      'rs11': true
    };

    var testCases = [
      {expression: 'and(rs1234, rs9)', shouldBe: false},
      {expression: '  or (rs1234, rs9, and  ( rs7788, gs037, rs9919, i169))', shouldBe: true},
      {expression: ' atleast(2, rs9, rs10, rs11))', shouldBe: true},
      {expression: 'and(rs1234, not(rs7), atleast(2, rs9, rs10, rs11))', shouldBe: false}
    ];

    testCases.forEach(testCase => {
      console.log('----');
      var filter = new LogicFilter();
      filter.compile(testCase.expression);

      console.log('Model:');
      console.log(util.inspect(filter.model, {depth: filter.maxDepth}));

      /*
      resolver requires a boolean return
       */
      var resolver = function (value) {
        return !!userdata[value];
      };

      var result = filter.execute(resolver) == testCase.shouldBe;
      console.log('----');

      assert(result, 'we expected ' + testCase.expression + ' to be ' + testCase.shouldBe);

    });
  });
});
