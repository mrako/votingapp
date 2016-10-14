'use strict';

var koa = require('koa');
var logger = require('koa-logger');
var mount = require('koa-mount');
var serve = require('koa-static');
var cors = require('koa-cors');

var apiV1 = require('./api/v1');

var app = module.exports = koa();

app.use(logger());

app.use(cors());

app.use(mount('/doc', serve('doc')));

app.use(mount('/api/v1', apiV1));
