'use strict';

var co = require('co');

var database = require('../lib/database');

function onerror(err) {
  console.error(err.stack);
}

co(function *() {
  yield database.sync({force: true});

  yield database.Project.create({ title: 'Compose to Kubernetes', team: 'marex' });
  yield database.Project.create({ title: 'TeamCity Commit status publisher plugin for Deveo', team: 'Ilmari' });
  yield database.Project.create({ title: 'Äänestäjä', team: 'mrako' });
  yield database.Project.create({ title: 'Efibot', team: 'Elina, Juuso, Lauri N. ja Tatu K.' });
  yield database.Project.create({ title: 'robot_pong', team: 'Rellu' });
  yield database.Project.create({ title: 'Dippa', team: 'elmis' });
  yield database.Project.create({ title: 'RobotSwagger', team: 'Lauri H., Heikki' });
  yield database.Project.create({ title: 'Docker pipeline platform', team: 'Tebro' });
  yield database.Project.create({ title: 'LightUpMyMexico', team: 'Niklas, Gaja, Jere' });
  yield database.Project.create({ title: 'Efilibrary Rewrite', team: 'Timo K., Antti H., Timo A.' });
  yield database.Project.create({ title: 'Sinun Eficodesi', team: 'Silden, Sollasvaara' });
   
  console.log("Projects added successfully.");
}).catch(onerror);
