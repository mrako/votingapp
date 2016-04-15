
var Sequelize = require('sequelize');
var URL = require('url');

function showMessage(reason) { console.error(reason.message); }

function parseDBUrl(str) {
  var url = URL.parse(str);
  var auth = url.auth.split(':');

  return {
    host: url.host,
    user: auth[0],
    pass: auth[1] || '',
    db: url.pathname.replace('/', '')
  };
}

function dbPrepare(dbUrl) {
  var pg = parseDBUrl(dbUrl);

  var sequelize = new Sequelize('postgres://postgres@' + pg.host + '/');

  return sequelize
    .query('CREATE ROLE ' + pg.user + ' WITH CREATEDB LOGIN PASSWORD :pass', {replacements: pg})
    .catch(showMessage)
    .then(function() {
      return sequelize.query('CREATE DATABASE ' + pg.db + ' WITH OWNER ' + pg.user);
    })
    .catch(showMessage);
}
