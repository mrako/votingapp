'use strict';

var database = require('../database');
var ClientError = require('../client-error');
var form = require('../form');


/**
 * @api {get} /api/v1/projects Read projects
 * @apiVersion 0.0.1
 * @apiName Getprojects
 * @apiGroup projects
 *
 */
exports.results = function *() {
  if (this.errors) {
    throw new ClientError('VALIDATION_ERROR', 400, this.errors);
  }

  var result;
  var query = this.query || {};
  var limit = query.limit || query.max || LIMIT;
  var offset = query.offset || 0;

  var options = {
    limit: limit,
    offset: offset,
    where: {}
  };

  result = yield database.Vote.findAndCountAll(options);

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
 * @api {post} /api/v1/votes Create voting Information
 * @apiVersion 0.0.1
 * @apiName CreateVote
 * @apiGroup vote
 * @apiPermission user
 *
 * @apiParam {String} points Points.
 *
 */
exports.create = function *() {
  this.checkBody('projectId').notEmpty();
  this.checkBody('points').notEmpty();

  if (this.errors) {
    throw new ClientError('VALIDATION_ERROR', 400, this.errors);
  }

  var attributes = form(this.request.body, ['projectId', 'points'], { userId: this.passport.user.id });
  var vote = database.Vote.build(attributes);

  try {
    yield vote.save();
  } catch (err) {
    throw new ClientError('SAVING_ERROR');
  }

  this.status = 201;
};
