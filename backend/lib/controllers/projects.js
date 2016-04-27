'use strict';

var _ = require('lodash');

var database = require('../database');
var sequelize = require('../models/sequelize');

var ClientError = require('../client-error');
var form = require('../form');

var LIMIT = require('../config').DEFAULT_LIMIT;

function *toJSON(project) {
  return {
    id: project.id,
    title: project.title,
    team: project.team,
    points: project.get('votecount')
  };
}

/**
 * @api {get} /api/v1/projects Read projects
 * @apiVersion 0.0.1
 * @apiName Getprojects
 * @apiGroup projects
 *
 */
exports.all = function *() {
  var result;
  var query = this.query || {};
  var limit = query.limit || query.max || LIMIT;
  var offset = query.offset || 0;

  var options = {
    limit: limit,
    offset: offset
  };

  result = yield database.Project.findAndCountAll(options);

  this.body = {
    results: yield result.rows.map(toJSON),
    metadata: {
      resultset: {
        count: result.count,
        offset: offset,
        limit: limit
      }
    }
  };
};

/**
 * @api {get} /api/v1/results Read results
 * @apiVersion 0.0.1
 * @apiName GetResults
 * @apiGroup results
 *
 */
exports.results = function *() {
  if (this.errors) {
    throw new ClientError('VALIDATION_ERROR', 400, this.errors);
  }

  var results;

  var options = {
    attributes: ['id', 'title', 'team', [sequelize.fn('sum', sequelize.col('votes.points')), 'votecount']],
    include: [{attributes: [], model: database.Vote}],
    group: ['project.id']
    //,order: [[sequelize.fn('sum', sequelize.col('votes.points')), 'DESC']]
  };

  results = yield database.Project.findAll(options);

  var map = yield results.map(toJSON);
  map = _.sortBy(map, function(o) { return parseInt(o.points) || 0; }).reverse();

  this.body = {
    results: map,
    metadata: {
      resultset: {
        count: map.length
      }
    }
  };
};

/**
 * @api {post} /api/v1/project Create project
 * @apiVersion 0.0.1
 * @apiName CreateProject
 * @apiGroup project
 * @apiPermission user
 *
 * @apiParam {String} title project title.
 * @apiParam {String} team project team.
 *
 */
exports.create = function *() {
  this.checkBody('title').notEmpty().isString();
  this.checkBody('team').notEmpty().isString();

  if (this.errors) {
    throw new ClientError('VALIDATION_ERROR', 400, this.errors);
  }

  var attributes = form(this.request.body, ['title', 'team']);
  var project = database.Project.build(attributes);

  try {
    yield project.save();
  } catch (err) {
    throw new ClientError('SAVING_ERROR');
  }

  this.status = 201;
  this.body = yield toJSON(project);
};
