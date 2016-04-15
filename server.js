'use strict';

var server = require('./lib/app');
var database = require('./lib/database');

var cluster = require('cluster');

var port = process.env.PORT || 8080;
var workers = require('os').cpus().length;

database.sync().then(function() {
  server.listen(port);
});
/*
if (cluster.isMaster) {
  database.sync().then(function() {
    for (var i = 1; i < workers; i++) {
      cluster.fork();
    }
  });

  cluster.on('exit', function (worker) {
    console.log('Worker ' + worker.process.pid + ' died');
    console.log('Spawining new worker.');
    cluster.fork();
  });
} else {
  server.listen(port);
}
*/

console.log('App listening on port ' + port);
