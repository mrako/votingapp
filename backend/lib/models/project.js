'use strict';

var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var Project = sequelize.define('project', {
  name: Sequelize.STRING,
  team: Sequelize.STRING
});

module.exports = Project;
