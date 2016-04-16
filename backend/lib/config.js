'use strict';

module.exports = {
  PORT: process.env.PORT || 9000,
  KEYS: ['ffa35f3369218969482e8ad0da77a2f1'],
  DEFAULT_LIMIT: 100,
  COOKIE_MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 days
  DATABASE_URL : process.env.DATABASE_URL || 'postgres://votingapp:votingapp@localhost/votingapp',
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || 'fake_app_id', //test app id
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || 'fake_app_secret' //test app secret
};
