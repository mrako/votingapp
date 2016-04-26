'use strict';

var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var passport = require('koa-passport');
var Router = require('koa-router');

var validate = require('koa-validate');
require('../validator');

var config = require('../config');

var auth = require('../controllers/auth');
var projects = require('../controllers/projects');
var votes = require('../controllers/votes');

var errorMiddleware = require('../client-error').middleware;

var app = module.exports = koa();


app.use(errorMiddleware);

app.keys = config.KEYS;
app.use(auth.session);

app.use(bodyParser());
app.use(validate());

app.use(passport.initialize());
app.use(passport.session());

var publicRouter = new Router();
publicRouter.post('/login', auth.login);
publicRouter.post('/logout', auth.logout);
publicRouter.post('/signup', auth.signUp);
publicRouter.post('/facebook/signin', auth.facebookSignIn);

publicRouter.get('/projects', projects.all);
publicRouter.post('/projects', projects.create);

publicRouter.get('/results', projects.results);

publicRouter.get('/votes/:email/allowed', votes.allowed);
publicRouter.post('/votes', votes.create);

app.use(publicRouter.middleware());

app.use(auth.authenticatedMiddleware);

var privateRouter = new Router();

privateRouter.get('/users/me', auth.current);


app.use(privateRouter.middleware());
