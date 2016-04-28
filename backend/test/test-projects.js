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

  it('should get a list of projects', function *() {
    var url = `/api/v1/projects`;

    var response = yield agent.get(url).expect(200).end();
    assert.equal(response.body.results.length, 3);
  });

  it('should get a list of results', function *() {
    yield agent.post('/api/v1/votes').send({projectId: project2.id, voter: 'tomme@email.com', points: 20}).expect(201).end();
    yield agent.post('/api/v1/votes').send({projectId: project3.id, voter: 'tomme@email.com', points: 5}).expect(201).end();

    var response = yield agent.get('/api/v1/results').expect(200).end();

    assert.equal(response.body.results.length, 3);
    assert.equal(response.body.results[0].id, project2.id);
    assert.equal(response.body.results[1].id, project3.id);
  });
/*
  it('shouldn't create project by unauthorized', function *() {
    var params = {title: 'projecttitle', team: 'no team'};
    yield agent.post('/api/v1/project').send(params).expect(401).end();
  });
*/
  it('should create project for user', function *() {
    var params = {title: 'projecttitle', team: 'no team'};
    //var user = yield helpers.login(agent);
    var response = yield agent.post('/api/v1/projects').send(params).expect(201).end();

    assert.equal(response.body.title, params.title);
    assert.equal(response.body.team, params.team);
  });
});
