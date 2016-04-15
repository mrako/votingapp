'use strict';

var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var Vote = sequelize.define('votes', {
  voter: Sequelize.STRING,
  points: Sequelize.INTEGER
});

module.exports = Vote;
