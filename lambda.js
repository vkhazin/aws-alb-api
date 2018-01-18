'use strict';

// Dependencies

const promise = require('bluebird')
const config = process.env.config
  ? JSON.parse(process.env.config)
  : require('config');
const logger = require('./logger').create(config);
const fileModule = require('./file-mock').create(config, logger);

// Handlers

const fileHandler = (event, context, callback) => {
  var action;
  switch (event.httpMethod) {
    case 'POST':
      var body = JSON.parse(event.body);
      action = fileModule.store(event.path, body);
      break;
    case 'DELETE':
      action = fileModule.delete(event.path);
      break;
    case 'GET':
      var qs = event.queryStringParameters || {};
      if (Number(qs.from) > -1 && Number(qs.size) > 0) {
        action = fileModule.list(event.path, Number(qs.from), Number(qs.size));
      } else {
        action = fileModule.fetch(event.path);
      }
      break;
    default:
      const response = {
        statusCode: 400,
        body: 'Bad Request'
      };
      callback(null, response);
      return promise.resolve(response);
  }

  return action.then(data => {
    const response = {
      statusCode: 200,
      body: data
    }
    callback(null, response);
    return promise.resolve(response);
  }).catch(err => {
    const response = {
      statusCode: 500,
      body: err
    };
    callback(null, response);
    return promise.resolve(response);
  });
}

// Routes

const routes = [
  {
    method: 'POST',
    path: '/*',
    handler: fileHandler
  }, {
    method: 'GET',
    path: '/*',
    handler: fileHandler
  }, {
    method: 'DELETE',
    path: '/*',
    handler: fileHandler
  }
];

const httpRouter = require('aws-lambda-http-router').create(routes);

exports.handler = httpRouter.handler;
