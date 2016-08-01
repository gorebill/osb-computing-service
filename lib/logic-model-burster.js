/**
 * Created by gorebill on 8/1/16.
 */



var DefaultFilter = function () {
  return false;
};

var DefaultResolver = function (node) {
  return node;
};

class LogicModelBurster {
  /**
   *
   * @param filter which node model should be resolved by burster
   * @param resolver how to burst this node model
   */
  constructor(filter, resolver) {
    this.filter = filter || DefaultFilter;
    this.resolver = resolver || DefaultResolver;
  }
}

export { LogicModelBurster as default };
