'use strict';

require('co-mocha');

var assert = require('assert');
var request = require('request');

var _ = require('lodash');

var config = require('../lib/config');
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

function *testSignIn(email, password, status) {
  return yield agent
  .post('/api/v1/signin')
    .send({email: email, password: password})
    .expect(status)
    .end();
}

function *userFromPasswordHash(email, hash) {
  var user = database.User.build({ email: email, password: 'tmp' });
  user.setDataValue('password', hash);
  user = yield user.save();
  return user;
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

  describe('facebook login', function() {
    var testUsers = {
      '129999730703854': {
        name: 'Helen Alajhadhcfhif Sidhuman',
        email: 'kxauwfv_sidhuman_1450364676@tfbnw.net'
      }
    };

    before(function*() {
      var host = 'https://graph.facebook.com/';
      var TOKEN_REGEX = /.*=(.*)/;
      var appId = config.FACEBOOK_APP_ID;
      var appSecret = config.FACEBOOK_APP_SECRET;

      var appToken = yield (new Promise(function(resolve) {
        request(host + 'oauth/access_token?client_id=' + appId
          + '&client_secret=' + appSecret
          + '&grant_type=client_credentials', function(error, res, body) {

            if (!error && res.statusCode == 200) {
              var match = body.match(TOKEN_REGEX);
              if(_.isNull(match)) throw 'Could not get facebook app token: ' + res + '\n' + body;
              resolve(match[1]);
            } else {
              throw 'Facebook request failed ' + error;
            }
          }
        );
      }));

      var testUserData = yield (new Promise(function(resolve) {
        request(host + appId + '/accounts/test-users/?access_token='
          + appToken, function(error, res, body) {

            if (!error && res.statusCode == 200) {
              resolve(JSON.parse(body));
            } else {
              throw 'Facebook request failed ' + error;
            }
          }
        );
      }));

      for (var testUser of testUserData.data) {
        if(testUsers[testUser.id]) {
          testUsers[testUser.id].token = testUser.access_token;
        }
      }
    });
  });

});
