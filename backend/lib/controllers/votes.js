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
exports.allowed = function *() {
  var result;

  var options = {
    where: {voter: this.params.email}
  };

  result = yield database.Vote.findAndCountAll(options);

  if (result.count < 3) {
    this.status = 200;
  } else {
    throw new ClientError('VALIDATION_ERROR', 405, 'voting not allowed for ' + this.params.email);
  }
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
  this.checkBody('voter').notEmpty();
  this.checkBody('points').notEmpty();

  if (this.errors) {
    throw new ClientError('VALIDATION_ERROR', 400, this.errors);
  }

  var attributes = form(this.request.body, ['voter', 'points', 'projectId']);

  var result;

  var options = {
    where: {voter: attributes.voter}
  };

  result = yield database.Vote.findAndCountAll(options);

  if (result.count < 3) {
    var vote = database.Vote.build(attributes);

    try {
      yield vote.save();
    } catch (err) {
      throw new ClientError('SAVING_ERROR');
    }

    this.status = 201;
  } else {
    throw new ClientError('VALIDATION_ERROR', 405, 'voting not allowed for ' + this.params.voter);
  }

};
