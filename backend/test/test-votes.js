'use strict';

require('co-mocha');

var assert = require('assert');
var helpers = require('./test-helpers');

var database = require('../lib/database');

var agent = require('./agent')();

describe('Vote', function() {

  var user, project;

  before(function *() {
    yield database.sync({force: true});

    user = yield database.User.create({ email: 'user@mrako.com', password: 'test' });

    project = yield database.Project.create({ name: 'test project', team: 'no team' });
  });

  beforeEach(function *() {
    yield helpers.logout(agent);
  });

  it("shouldn't create vote for unauthorized", function *() {
    var url = `/api/v1/votes`;
    yield agent.post(url).expect(401).end();
  });

  it("should create a vote for user", function *() {
    var url = `/api/v1/votes`;
    var params = {projectId: project.id, points: 3};

    yield helpers.login(agent, user);
    yield agent.post(url).send(params).expect(201).end();
  });
});
