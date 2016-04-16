
var database = require('./lib/database');

database.sync({force: true});

database.Project.create({ title: 'Compose to Kubernetes', team: 'marex' });
database.Project.create({ title: 'TeamCity Commit status publisher plugin for Deveo', team: 'Ilmari' });
database.Project.create({ title: 'Äänestäjä', team: 'mrako' });
database.Project.create({ title: 'Efibot', team: 'Elina, Juuso, Lauri N. ja Tatu K.' });
database.Project.create({ title: 'robot_pong', team: 'Rellu' });
database.Project.create({ title: 'Dippa', team: 'elmis' });
database.Project.create({ title: 'RobotSwagger', team: 'Lauri H., Heikki' });
database.Project.create({ title: 'Docker pipeline platform', team: 'Tebro' });
database.Project.create({ title: 'LightUpMyMexico', team: 'Niklas, Gaja, Jere' });
database.Project.create({ title: 'Efilibrary Rewrite', team: 'Timo K., Antti H., Timo A.' });
database.Project.create({ title: 'Sinun Eficodesi', team: 'Silden, Sollasvaara' });
