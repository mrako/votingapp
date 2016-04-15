/*eslint no-console: 0*/
'use strict';

var ClientError = module.exports = function(code, status, info) {
  this.code = code || 'USER_ERROR';
  this.status = status || 400;
  this.info = info || '';
};

ClientError.prototype = Object.create(Error.prototype);

ClientError.middleware = function *(next) {
  try {
    yield next;
  } catch (err) {
    var response;
    if (err instanceof ClientError) {
      response = {
        status: err.status,
        userMessage: err.code,
        errorCode: err.code,
        moreInfo: err.info
      };
      this.body = response;
      this.status = err.status;
    } else {
      console.log(err.stack);
      response = {
        status: 500,
        userMessage: 'Internal server error',
        errorCode: 'SERVER_ERROR',
        moreInfo: ''
      };
      this.status = 500;
      this.body = response;
    }
  }
};
