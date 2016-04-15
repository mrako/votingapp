'use strict';

var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var bcrypt = require('bcrypt');

var User = sequelize.define('users', {
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    set: function(str) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(str, salt);

      this.setDataValue('password', hash);
    }
  },
  facebookId: {
    type: Sequelize.STRING,
    unique: true,
    field: 'facebook_id'
  },
  role: Sequelize.STRING
}, {
  instanceMethods: {
    passwordMatch: function(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }
});

module.exports = User;
