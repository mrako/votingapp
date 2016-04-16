
var database = require('./lib/database');

database.sync({force: true});

database.Project.create({ title: 'project 1', team: 'no team' });
database.Project.create({ title: 'project 2', team: 'no team' });
database.Project.create({ title: 'project 3', team: 'no team' });
database.Project.create({ title: 'project 4', team: 'no team' });
database.Project.create({ title: 'project 5', team: 'no team' });
