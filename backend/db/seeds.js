'use strict';

var co = require('co');

var database = require('../lib/database');

function onerror(err) {
  console.error(err.stack);
}

co(function *() {
  yield database.sync({force: true});

  yield database.Project.create({ title: 'Openstack Ranchering', team: 'tebro' });
  yield database.Project.create({ title: 'Artifactory Group', team: 'failattu' });
  yield database.Project.create({ title: 'Gitviz', team: 'lauri, jnevalainen' });
  yield database.Project.create({ title: 'Saatiobot', team: 'mrako' });
  yield database.Project.create({ title: 'Pydamsa', team: 'haeroe' });
  yield database.Project.create({ title: 'Watson', team: 'rellu' });
  yield database.Project.create({ title: '#thanksatlassian', team: 'altha' });
  yield database.Project.create({ title: 'Good Enough Auction', team: 'eero, aromu' });
  yield database.Project.create({ title: 'Triviabot', team: 'smuro, elina, tebro' });
   
  console.log("Projects added successfully.");
}).catch(onerror);
