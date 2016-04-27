'use strict';

var gulp = require('gulp');

var jshint = require('gulp-jshint');
var apidoc = require('gulp-apidoc');
/*
gulp.task('db:prepare', function(done) {
  if(!process.env.DATABASE_URL) throw new Error('Environment variable DATABASE_URL is not defined');

  dbPrepare(process.env.DATABASE_URL).then(done);
});
*/
gulp.task('jshint', function() {
  return gulp.src(['lib/**/*.js', 'test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('apidoc', function(done) {
  apidoc({
    src: 'lib/',
    dest: 'doc/'
  }, done);
});

gulp.task('heroku:production', ['apidoc']);

gulp.task('default', ['jshint']);
