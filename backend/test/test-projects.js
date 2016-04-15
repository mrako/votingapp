'use strict';

require('co-mocha');

var assert = require('assert');
var helpers = require('./test-helpers');

var database = require('../lib/database');

var agent = require('./agent')();

describe('Project', function() {

  var project;

  before(function *() {
    yield database.sync({force: true});

    project = yield database.Project.create({ name: 'test project', team: 'no team' });
  });

  beforeEach(function *() {
    yield helpers.logout(agent);
  });

  it("should get a list of projects", function *() {
    var url = `/api/v1/projects`;

    var response = yield agent.get(url).expect(200).end();
    assert.equal(response.body.results.length, 1);
  });
});
