import assert from 'assert';
import LogicFilter from '../lib/logic-filter';
import LogicModelBurster from '../lib/logic-model-burster';

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

  it('LogicFilter with LogicModelBurster unit test', function () {

    var gsFilter = function (node) {
      return /^gs\d+/i.test(node);
    };

    var gsMap = {
      'gs101': 'or(rs10, gs103)',
      'gs102': 'not(rs51, rs52)',
      'gs103': 'atleast(1, rs10, rs11)'
    };

    var gsResolver = function (node) {
      // should return a model
      return gsMap[node];
    };

    var gsBurster = new LogicModelBurster(gsFilter, gsResolver);

    var userdata = {
      'rs1234': true,
      'rs10': true,
      'rs11': true
    };

    var testCases = [
      {expression: 'and(rs1234, gs101, gs102)', shouldBe: true},
      {expression: 'not(rs1234, gs101, gs102)', shouldBe: false},
      {expression: 'or(gs104, gs105)', shouldBe: false}//测试不存在的gs
    ];

    testCases.forEach(testCase => {
      console.log('----');
      var filter = new LogicFilter();
      filter.addBurster(gsBurster);
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
