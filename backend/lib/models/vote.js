'use strict';

var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var Vote = sequelize.define('votes', {
  points: Sequelize.INTEGER
});

module.exports = Vote;
