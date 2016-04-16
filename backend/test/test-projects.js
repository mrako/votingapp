'use strict';

require('co-mocha');

var assert = require('assert');
var helpers = require('./test-helpers');

var database = require('../lib/database');

var agent = require('./agent')();

describe('Project', function() {

  var project1, project2, project3;

  before(function *() {
    yield database.sync({force: true});

    project1 = yield database.Project.create({ title: 'test project 1', team: 'no team' });
    project2 = yield database.Project.create({ title: 'test project 2', team: 'no team' });
    project3 = yield database.Project.create({ title: 'test project 3', team: 'no team' });
  });

  beforeEach(function *() {
    yield helpers.logout(agent);
  });

  it("should get a list of projects", function *() {
    var url = `/api/v1/projects`;

    var response = yield agent.get(url).expect(200).end();
    assert.equal(response.body.results.length, 3);
  });

  it("should get a list of results", function *() {
    var url = `/api/v1/results`;

    var response = yield agent.get(url).expect(200).end();

    assert.equal(response.body.results.length, 3);
  });


  it("should get a list of results", function *() {
    yield agent.post('/api/v1/votes').send({projectId: project2.id, voter: "tomme@email.com", points: 3}).expect(201).end();

    var response = yield agent.get('/api/v1/results').expect(200).end();

    assert.equal(response.body.results.length, 3);
  });
});
