'use strict';

var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var User = sequelize.define('users', {
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  },
  facebookId: {
    type: Sequelize.STRING,
    unique: true,
    field: 'facebook_id'
  },
  role: Sequelize.STRING
});

module.exports = User;
