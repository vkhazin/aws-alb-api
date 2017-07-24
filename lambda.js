'use strict';
/*********************************************************************************
Dependencies
**********************************************************************************/
const promise             = require('bluebird')
const config 		          = require('config');
const logger              = require('./logger').create(config);
const echoModule          = require('./echo').create(config, logger);
const targetGroupModule   = require('./targetGroup').create(config, logger);
/*********************************************************************************/

/*********************************************************************************/
//Handlers
/*********************************************************************************/
const echoHandler = (event, context, callback) => {
  return echoModule.echo()
    .then(data => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(data)
      }
      callback(null, response);
      return promise.resolve(response);
    });
}

/*********************************************************************************/
//Routes
/*********************************************************************************/
const routes = [
  {
    method: 'GET',
    path: '/',
    handler: echoHandler
  },
  {
    method: 'GET',
    path: '/echo',
    handler: echoHandler
  }
];

const httpRouter		    = require('./http-router').create(routes);
/*********************************************************************************/


exports.handler = httpRouter.handler;
