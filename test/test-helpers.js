'use strict';
var factories = require('./factories');

module.exports = {
  login: function *(agent, user, password) {
    if(!password) { password = 'test'; }

    if(!user) {
      user = yield factories.user({password: password});
    }

    var response = yield agent.post('/api/v1/login').send({email: user.email, password: password}).end();

    agent.setAuthToken(response.body.user.token);

    return user;
  },

  logout: function *(agent) {
    yield agent.post('/api/v1/logout').end();
    agent.resetAuthToken();
  }
};
