import assert from 'assert';
import osbComputingService from '../lib';

describe('osb-computing-service', function () {
  it('index unit test', function () {
    assert(osbComputingService.LogicFilter !== null, 'we expected to be existed');
  });
});
