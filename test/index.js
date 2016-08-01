import assert from 'assert';
import osbComputingService from '../lib';

describe('osb-computing-service', function () {
  it('index unit test', function () {
    assert(osbComputingService.LogicFilter !== null, 'we expected LogicFilter to be existed');
    assert(osbComputingService.LogicModelBurster !== null, 'we expected LogicModelBurster to be existed');
  });
});
