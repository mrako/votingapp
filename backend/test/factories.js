'use strict';
var _ = require('lodash');
var database = require('../lib/database');

var i = 0;

function email() {
  return 'user' + i++ + '@mrako.com';
}

function password() {
  return 'test' + i++;
}

function *user(options) {
  options = _.merge({
    email: email(),
    password: password()
  }, options);

  return yield database.User.create(options);
}

module.exports = {
  user: user
};
