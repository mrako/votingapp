'use strict';

require('co-mocha');

var database = require('../lib/database');

var agent = require('./agent')();

describe('Vote', function() {

  var user, project1, project2, project3;

  before(function *() {
    yield database.sync({force: true});

    user = yield database.User.create({ email: 'user@mrako.com', password: 'test' });

    project1 = yield database.Project.create({ title: 'test project 1', team: 'no team' });
    project2 = yield database.Project.create({ title: 'test project 2', team: 'no team' });
    project3 = yield database.Project.create({ title: 'test project 3', team: 'no team' });
  });

  beforeEach(function *() {
  });
/*
  it('shouldn't create vote for unauthorized', function *() {
    var url = `/api/v1/votes`;
    yield agent.post(url).expect(401).end();
  });

  it('should create a vote for user', function *() {
    var url = `/api/v1/votes`;
    var params = {projectId: project.id, voter: 'tomme@email.com', points: 3};

    yield helpers.login(agent, user);
    yield agent.post(url).send(params).expect(201).end();
  });
*/

  it('should allow voting for user', function *() {
    var voter = 'tomme@email.com';
    var url = `/api/v1/votes/${voter}/allowed`;

    yield agent.get(url).expect(200).end();
  });

  it('should create a vote', function *() {
    var url = `/api/v1/votes`;
    var params = {projectId: project1.id, voter: 'tomme@email.com', points: 5};

    yield agent.post(url).send(params).expect(201).end();
  });

  it('should create two more votes', function *() {
    var url = `/api/v1/votes`;

    yield agent.post(url).send({projectId: project2.id, voter: 'tomme@email.com', points: 3}).expect(201).end();
    yield agent.post(url).send({projectId: project3.id, voter: 'tomme@email.com', points: 1}).expect(201).end();
  });

  it('should not allow voting for user who has three votes', function *() {
    var voter = 'tomme@email.com';
    var url = `/api/v1/votes/${voter}/allowed`;

    yield agent.get(url).expect(405).end();
  });

  it('should not create fourth vote', function *() {
    var url = `/api/v1/votes`;

    yield agent.post(url).send({projectId: project3.id, voter: 'tomme@email.com', points: 1}).expect(405).end();
  });
});
