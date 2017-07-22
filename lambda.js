'use strict';
/*********************************************************************************
Dependencies
**********************************************************************************/
const promise             = require('bluebird')
const appInfo             = require('./package')
const config 		          = require('config');
const logger              = require('./logger').create(config);
const healthCheckModule   = require('./healthCheck').create(config, logger);
/*********************************************************************************/

const echo = function() {
  return promise.resolve ({
    name: appInfo.name,
    version: appInfo.version,
    description: appInfo.description,
    author: appInfo.author,
    node: process.version
  });
};

exports.handler = (event, context, callback) => {

  logger.trace(event)
  logger.trace(context)
  
  let response = {
    statusCode: 500,
    body: 'Unexpected error'
  };
  
  return new promise(resolve => {
    switch (event.httpMethod) {
      case 'GET':
        if (event.path.toLowerCase() === '/healthcheck') {
          return healthCheckModule.ping()
            .then(response => {
              return resolve({
                statusCode: 200,
                body: response  
              })
          })
            .catch(response => {
              return resolve({
                statusCode: 500,
                body: response  
              });            
          })
        } else {
          return echo()
            .then(data => {
              return resolve({
                statusCode: 200,
                body: data 
              })
            })
        }
        break;
      default:
        response = {
          statusCode: 400,
          body: {
            message: "Unsupported method or path"
          }
        };
        logger.error(response);
        return resolve(response)
    }    
  })
  .then(response => {
    if (response.body) {
      response.body = JSON.stringify(response.body);
    }
    callback(null, response);
    return promise.resolve(response);    
  });
  
};