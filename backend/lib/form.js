'use strict';

var _ = require('lodash');
var ClientError = require('./client-error');

function toCamel(str) {
  return str.replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
}

module.exports = function(body, keys, assign) {
  var attributes = {};

  keys.forEach(function(key) {
    var val = body[toCamel(key)];
    if(!_.isUndefined(val) && !_.isNaN(val)) { attributes[key] = val; }
  });

  if(assign) {
    return _.assign(attributes, assign);
  }

  return attributes;
};

module.exports.relation = function*(id, model) {
  var inst = yield model.find({where: {id: id}});
  if(!inst) { throw new ClientError('MODEL_NOT_FOUND', 400, model.getTableName()); }
  return inst;
};

module.exports.ids = function*(ids, model) {
  return yield ids.map(function*(id) {
    var inst = yield model.find({where: {id: id}});
    if(!inst) { throw new ClientError('MODEL_NOT_FOUND', 400, model.getTableName()); }
    return inst;
  });
};
