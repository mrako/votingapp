'use strict';

var database = require('../database');
var ClientError = require('../client-error');
var form = require('../form');

var LIMIT = require('../config').DEFAULT_LIMIT;

function *toJSON(project) {
  return {
    id: project.id,
    title: project.title,
    team: project.team
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
