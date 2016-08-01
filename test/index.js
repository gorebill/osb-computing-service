import assert from 'assert';
import osbComputingService from '../lib';

import util from 'util';

describe('osb-computing-service', function () {
  it('LogicFilter unit test', function () {

    var userdata = {
      'rs1234': true,
      'rs10': true,
      'rs11': true
    };

    var testCases = [
      {expression: 'and(rs1234, rs9)', shouldBe: true},
      {expression: '  or (rs1234, rs9, and  ( rs7788, gs037, rs9919, i169))', shouldBe: true},
      {expression: 'and(rs1234, not(rs7), atleast(2, rs9, rs10, rs11))', shouldBe: true}
    ];

    testCases.forEach(testCase => {
      var filter = new osbComputingService.LogicFilter();
      filter.compile(testCase.expression);

      console.log('----');
      console.log('Model:');
      console.log(util.inspect(filter.model, {depth: filter.maxDepth}));
      console.log('----');

      var result = filter.execute(userdata) == testCase.shouldBe;
      assert(result, 'we expected ' + testCase.expression + ' to be ' + testCase.shouldBe);
    });
  });
});
