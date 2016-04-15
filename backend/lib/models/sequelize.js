'use strict';

var Sequelize = require('sequelize');
var config = require('../config');

var sequelize = new Sequelize(config.DATABASE_URL, {
  logging: false
});

/* TO ENABLE SSL
var sequelize = new Sequelize(config.DATABASE_URL, {
  logging: false,
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  }
});
*/

module.exports = sequelize;
