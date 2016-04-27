'use strict';

var _ = require('lodash');
var Validator = require('koa-validate').Validator;

function isTypeOf(type) {
  return function(item) {
    return typeof item === type;
  };
}

Validator.prototype.isArray = function(type, tip) {
  if(!this.goOn) { return this; }

  if(!Array.isArray(this.value)) {
    this.addError(tip || this.key + ' should be an Array of ' + type);
  } else if(!_.all(this.value, isTypeOf(type))) {
    this.addError(tip || this.key + ' should be an Array of ' + type);
  }
  return this;
};

Validator.prototype.isJSON = function(tip) {
  if(!this.goOn) { return this; }

  if(!_.isPlainObject(this.value)) {
    this.addError(tip || this.key + ' should be an Object');
  }

  return this;
};

Validator.prototype.isString = function(tip) {
  if(!this.goOn) { return this; }

  if(!_.isString(this.value)) {
    this.addError(tip || this.key + ' should be a String');
  }

  return this;
};

Validator.prototype.isIn = function(arr, tip) {
  if(!this.goOn) { return this; }

  if(arr.indexOf(this.value) < 0) {
    this.addError(tip || this.key + ' should be one of ' + arr.join(', '));
  }

  return this;
};

Validator.prototype.isBoolean = function(tip) {
  if(!this.goOn) { return this; }

  if(!_.isBoolean(this.value)) {
    this.addError(tip || this.key + ' should be a Boolean');
  }
  return this;
};

Validator.prototype.allowNull = function() {
  if(!this.goOn) { return this; }

  if(_.isNull(this.value)) { this.goOn = false; }

  return this;
};
