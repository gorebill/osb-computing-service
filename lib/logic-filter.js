/**
 * Created by gorebill on 8/1/16.
 */

import escapeStringRegex from 'escape-string-regexp';
import _ from 'lodash';
import util from 'util';

export { LogicFilter as default };

function LogicFilter() {
  this['criteria'] = null;
  this['model'] = null;

  this.maxDepth = 10;
  this.currentDepth = 0;

  this.leftQuote = '(';
  this.rightQuote = ')';
  this.paramSplitter = ',';

  this.operators = {
    'and': function () {},
    'or': function () {},
    'not': function () {},
    'atleast': function () {}
  };
}


LogicFilter.prototype.compile = function (criteria) {
  // build compute model by criteria expression
  this['criteria'] = criteria;
  this.model = [];
  this.currentDepth = 0;

  this.interpret(criteria, this.model);

};

LogicFilter.prototype.execute = function (dataset) {
  // TODO: execute input data


  return dataset !== null;
};

LogicFilter.prototype.interpret = function (remain, model) {

  if(++this.currentDepth > this.maxDepth) {
    console.log('Model:');
    console.log(util.inspect(this.model, {depth: this.maxDepth}));
    throw new Error('Max stack exceeds: ' + this.maxDepth);
  }

  while(remain !== null && remain.length > 0) {
    var operator;
    if((operator = this.beginWithOperators(remain)) !== null) {
      // 执行operator分离function
      remain = this.handleOperator(operator, remain, model);
    }else if(this.isBeginWithSplitter(remain)) {
      // 若存在参数分隔符, 则去除
      remain = this.handleSplitter(remain);
    }else if(this.isBeginWithCloseQuote(remain)) {
      remain = this.handleCloseQuote(remain);
      return remain;// return to upper level
    }else {
      // 执行params分离function
      remain = this.handleArgument(remain, model);
    }
  }

  return remain;
};

LogicFilter.prototype.handleSplitter = function (input) {
  var regexp = this.regexForSplitter();

  var result;
  if((result = regexp.exec(input)) !== null) {
    var remain = input.slice(result[0].length);
    return remain;
  }
  return null;
};

LogicFilter.prototype.handleArgument = function (input, model) {
  var regexp = this.regexForArgument();
  var result;
  if((result = regexp.exec(input)) !== null) {
    var remain = input.slice(result[0].length);
    model.push(result[1]);
    return remain;
  }
  return null;
};

LogicFilter.prototype.handleCloseQuote = function (input) {
  var regexp = this.regexForCloseQuote();

  var result;
  if((result = regexp.exec(input)) !== null) {
    var remain = input.slice(result[0].length);
    return remain;
  }

  throw new Error('Can not find right(close) quote.');
};

LogicFilter.prototype.handleOperator = function (operator, input, model) {

  var regexp = this.regexForOperator(operator);

  /*
   eg.
   [ '   and   (',
   'and',
   index: 0,
   input: '   and   (rs1234,and(rs6,rs7),and(rs8,rs9))' ]
   */
  var result;
  if((result = regexp.exec(input)) !== null) {
    var remain = input.slice(result[0].length);

    var node = [];
    node['operator'] = result[1];
    model.push(node);

    remain = this.interpret(remain, node);

    return remain;
  }

  return null;
};

LogicFilter.prototype.isBeginWithSplitter = function (input) {
  var regexp = this.regexForSplitter();
  return regexp.test(input);
};

LogicFilter.prototype.isBeginWithCloseQuote = function (input) {
  var regexp = this.regexForCloseQuote();
  return regexp.test(input);
};

LogicFilter.prototype.beginWithOperators = function (input) {
  var result = null;
  var _this = this;
  _.each(this.operators, function (func, operator) {
    if(_this.isBeginWithOperator(operator, input)) {
      result = operator;
    }
  });
  return result;
};

LogicFilter.prototype.isBeginWithOperator = function (operator, input) {
  var regexp = this.regexForOperator(operator);

  if(regexp.test(input)) {
    return true;
  }
  return false;
};

LogicFilter.prototype.regexForCloseQuote = function () {
  var regexp = new RegExp(
    '^[\\s\\t\\n]*'
    + '('
    + escapeStringRegex(this.rightQuote)
    + ')'
    + '[\\s\\t\\n]*'
    ,'im');

  return regexp;
};

LogicFilter.prototype.regexForSplitter = function () {
  var regexp = new RegExp(
    '^[\\s\\t\\n]*'
    + '('
    + escapeStringRegex(this.paramSplitter)
    + ')'
    + '[\\s\\t\\n]*'
    ,'im');

  return regexp;
};

LogicFilter.prototype.regexForOperator = function (operator) {
  var regexp = new RegExp(
    '^[\\s\\t\\n]*'
    + '\\b('
    + escapeStringRegex(operator)
    + ')'
    + '[\\s\\t\\n]*'
    + escapeStringRegex(this.leftQuote)
    ,'im');

  return regexp;
};

LogicFilter.prototype.regexForArgument = function () {
  // 因为优先级最低,所以只考虑 splitter,rightQuote,$ 结尾
  var regexp = new RegExp(
    '^[\\s\\t\\n]*'
    + '(\\w*)'
    + '[\\s\\t\\n]*'
    + '[,' + escapeStringRegex(this.rightQuote) + '\\$]'
    ,'im');

  return regexp;
};


