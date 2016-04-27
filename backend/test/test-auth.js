'use strict';

require('co-mocha');

var assert = require('assert');

var _ = require('lodash');

var database = require('../lib/database');

var agent = require('./agent')();
//var factories = require('./factories');
//var config = require('../lib/config');

function *testSignUp(firstname, lastname, email, password, status) {
  return yield agent
  .post('/api/v1/signup')
    .send({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password
    })
    .expect(status || 201)
    .end();
}

describe('Authorization', function() {

  before(function *() {
    yield database.sync({force: true});
  });

  describe('signup', function() {

    it('should create a user', function *() {
      var response = yield testSignUp('a', 'b', 'a@b.com', 'a', 201);
      assert(_.isString(response.body.user.token));
    });
/*
    it('should refuse to create a user', function *() {
      yield testSignUp('A@B.com', 'a', 400);
      yield testSignUp('bad email', 'a', 400);
      yield testSignUp(null, 'a', 400);
      yield testSignUp('a@b.com', null, 400);
      yield testSignUp(null, null, 400);
      yield testSignUp('c@d.com', 'a', 400, '');
      yield testSignUp('c@d.com', 'a', 400, 'Bad country');
    });
*/
  });
});
