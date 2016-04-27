'use strict';

var genericSession = require('koa-generic-session');

var passport = require('koa-passport');
var FacebookStrategy = require('passport-facebook-token');

var _ = require('lodash');

var config = require('../config');
var database = require('../database');
var ClientError = require('../client-error');

var TOKEN_REGEX = /Bearer (.*)/i;

exports.session = genericSession({
  store: database.sessionStore,

  sessionIdStore: {

    get: function() {
      var header = this.header.authorization;
      if(!header) { return; }

      var match = header.match(TOKEN_REGEX);
      if(_.isNull(match)) { return; }

      return match[1];
    },

    set: _.noop,
    reset: _.noop
  }
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  database.User.find({where: {id: id}}).then(
    function(user) {
      done(null, user);
    },
    function(err)  {
      done(err);
    });
});


function *toJSON(user, sessionId) {
  return {
    user: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      token: sessionId
    }
  };
}

/**
 * @api {post} /api/v1/signup Sign Up
 * @apiVersion 0.0.1
 * @apiName SignUp
 * @apiGroup Auth
 *
 * @apiParam {String} name User's name
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 *
 */
exports.signUp = function *() {
  this.checkBody('firstname').notEmpty('REQUIRED_FIELD').isString();
  this.checkBody('lastname').notEmpty('REQUIRED_FIELD').isString();
  this.checkBody('email').isEmail('INVALID_EMAIL');
  this.checkBody('password').notEmpty('REQUIRED_FIELD').isString();

  if (this.errors) {
    throw new ClientError('VALIDATION_ERROR', 400, this.errors);
  }

  var body = this.request.body;

  var attributes = {
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email.toLowerCase(),
    password: body.password,
    birthYear: body.birthYear,
    role: 'user'
  };

  var user = database.User.build(attributes);

  try {
    yield user.save();
  } catch (err) {
    throw new ClientError('EMAIL_IN_USE');
  }

  yield this.logIn(user);

  this.response.body = yield toJSON(user, this.sessionId);

  this.status = 201;
};

/**
 * @api {post} /api/v1/login Login
 * @apiVersion 0.0.1
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 *
 */
exports.login = function *() {
  this.checkBody('email').isEmail('INVALID_EMAIL');
  this.checkBody('password').notEmpty('REQUIRED_FIELD').isString();

  if (this.errors) { throw new ClientError('VALIDATION_ERROR', 400, this.errors); }

  var body = this.request.body;
  var user = yield database.User.find({where: {email: body.email.toLowerCase()}});

  if (!user) {
    throw new ClientError('INCORRECT_EMAIL');
  }

  var match = user.passwordMatch(body.password);
  if (!match) {
    throw new ClientError('INCORRECT_PASSWORD');
  }

  yield this.logIn(user);

  this.response.body = yield toJSON(user, this.sessionId);

  this.status = 200;
};

passport.use(new FacebookStrategy(
  {
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET
  },
  function(accessToken, refreshToken, profile, done) {
    database.User.find({where: {facebookId: profile.id}}).then(

      function(user) {
        if (user) { return done(null, user); }

        var email = _.get(profile, 'emails[0].value');
        var promise;
        if (email) {
          email = email.toLowerCase();
          promise = database.User.find({ where: {email: email} });
        } else {
          promise = new Promise(function(resolve) { resolve(null); });
        }

        promise.then(function(user) {
          var options = { facebookId: profile.id, role: 'user' };
          if(user) {
            return user.updateAttributes(options);
          } else {
            if(email) { options.email = email; }
            return database.User.create(options);
          }
        })

        .then(function(user) {
          done(null, user);
        });

      }
    );
  })
);

/**
 * @api {post} /api/v1/facebook/signin Login throught Facebook account
 * @apiVersion 0.0.1
 * @apiName SignInFacebook
 * @apiGroup Auth
 *
 * @apiParam {String} access_token Facebook access token
 * @apiParam {String} [ refresh_token ] Facebook refresh token
 */
exports.facebookSignIn = function*() {
  yield passport.authenticate('facebook-token').call(this, function*() {
    var user = this.passport.user;
    this.response.body = yield toJSON(user, this.sessionId);
    //this.response.body = { user: { name: user.name, email: user.email, role: user.role, token: this.sessionId } };
    this.status = 200;
  });
};

/**
 * @api {post} /api/v1/logout Logout
 * @apiVersion 0.0.1
 * @apiName Logout
 * @apiGroup Auth
 *
 */
exports.logout = function *() {
  this.logout();
  this.status = 204;
};


/**
 * @api {get} /api/v1/users/me Read Current Authorized User
 * @apiVersion 0.0.1
 * @apiName GetCurrentUser
 * @apiGroup Users
 * @apiPermission user
 */
exports.current = function *() {
  var user = this.passport.user;
  this.body = yield toJSON(user, null);
};


exports.authenticatedMiddleware = function *(next) {
  if (!this.isAuthenticated()) {
    throw new ClientError('UNAUTHORIZED', 401);
  }
  yield next;
};
