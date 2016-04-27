'use strict';

var methods = require('methods');
var TestAgent = require('co-supertest').agent;
var app = require('../lib/app');

function Agent(app) {
  TestAgent.call(this, app);
  this.token = null;
}

Agent.prototype.__proto__ = TestAgent.prototype;

methods.forEach(function(method) {
  Agent.prototype[method] = function(url, fn) {

    var apiUrl = url;

    var req = TestAgent.prototype[method].call(this, apiUrl, fn);

    if(this.token) {
      req.set('Authorization', 'Bearer ' + this.token);
    }

    return req.expect(function onlyAcceptJson(res) {
      if(res.status === 204) { return; }
      if(res.type !== 'application/json') {
        return 'All API endpoints must return a valid JSON or 204. Content type: ' + res.type;
      }
    });
  };
});

Agent.prototype.setAuthToken = function(token) {
  this.token = token;
};

Agent.prototype.resetAuthToken = function() {
  this.token = null;
};

Agent.prototype.del = Agent.prototype.delete;

module.exports = function() {
  return new Agent(app.listen());
};
