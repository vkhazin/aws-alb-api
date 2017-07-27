'use strict';
/*********************************************************************************
Dependencies
**********************************************************************************/
const promise             = require('bluebird')
const config 		          = require('config');
const logger              = require('./logger').create(config);
const echoModule          = require('./echo').create(config, logger);
const targetGroupModule   = require('./targetGroup').create(config, logger);
const ec2Module           = require('./ec2').create(config, logger);
const auth                = require('./auth').create(config, logger);
/*********************************************************************************/

/*********************************************************************************/
//Utilities
/*********************************************************************************/
const getApiKey = (event) => {
  const apiKey = (event.headers)? event.headers[config.auth.authHeader]: null;
  return apiKey;
};

const authWrapper = (requestHandler, event, context, callback) => {
  const apiKey = getApiKey(event);
  const targetGroupArn = event.pathParameters.targetGroupArn; 
  
  return auth.authCZ(apiKey, targetGroupArn)
    .then(authCZ => requestHandler(event, context, callback))
    .catch(auth.NotAuthenticated, err => {
      const response = {
        statusCode: 401,
        body: err.message.error
      };
      callback(null, response);
      return promise.resolve(response);      
    })
    .catch(auth.NotAuthorized, err => {
      const response = {
        statusCode: 403,
        body: err.message.error
      };
      callback(null, response);
      return promise.resolve(response); 
    })  
    .catch(err => {
      const response = {
        statusCode: 500,
        body: err
      };
      callback(null, response);
      return promise.resolve(response);
    });
}

/*********************************************************************************/
//Handlers
/*********************************************************************************/
const echoHandler = (event, context, callback) => {
  return echoModule.echo()
    .then(data => {
      const response = {
        statusCode: 200,
        body: data
      }
      callback(null, response);
      return promise.resolve(response);
    })
    .catch(err => {
      const response = {
        statusCode: 500,
        body: err
      }
      callback(null, response);
      return promise.resolve(response);    
    });
}

const describeGroupHealthHandler = (event, context, callback) => {

  return authWrapper((event, context, callback) => {
      const targetGroupArn = event.pathParameters.targetGroupArn;
      return targetGroupModule.getTargetsHealth(targetGroupArn)
        .then(groupData => {
          const instanceIds = groupData.map(target => target.Target.Id);
          if (instanceIds.length > 0) {
            return ec2Module.describeInstances(instanceIds)
              .then(instancesData => {
                const transformedGroupData = groupData.map(target => {
                  const filteredInstancesData = instancesData.filter(instanceData => instanceData.InstanceId == target.Target.Id);
                  if (filteredInstancesData.length > 0) {
                    const instanceData = filteredInstancesData[0];
                    target.Target.Instance = {
                      InstanceType: instanceData.InstanceType,
                      Placement: instanceData.Placement,
                      State: instanceData.State,
                      SubnetId: instanceData.SubnetId
                    };
                  }
                  return target;
                });

                const response = {
                  statusCode: 200,
                  body: transformedGroupData
                }
                callback(null, response);
                return promise.resolve(response);
            }); 
          } else {
              const response = {
                statusCode: 200,
                body: groupData
              }
              callback(null, response);
              return promise.resolve(response);          
          }
      });
    }, 
    event, context, callback);
  
};

const deregisterTargets = (event, context, callback) => {
  
  return authWrapper((event, context, callback) => {
    const targetGroupArn = event.pathParameters.targetGroupArn;
    const instanceId = event.pathParameters.instanceId;
    const port = event.pathParameters.port;
    const body = (event.body)? JSON.parse(event.body): undefined;

    const targets = body || [
      {
        Id: instanceId,
        Port: port
      }
    ];

    return targetGroupModule.deregisterTargets(targetGroupArn, targets)
      .then(deregisterResponse => {
      return targetGroupModule.getTargetsHealth(targetGroupArn, targets)
        .then(targetGroupResponse => {
        const response = {
          statusCode: 200,
          body: targetGroupResponse
        };
        callback(null, response);
        return promise.resolve(response);           
      })     
    })   
  },
  event, context, callback);
}

const registerTargets = (event, context, callback) => {
  
    return authWrapper((event, context, callback) => {
      
      const targetGroupArn = event.pathParameters.targetGroupArn;
      const instanceId = event.pathParameters.instanceId;
      const port = event.pathParameters.port;
      const body = (event.body)? JSON.parse(event.body): undefined;
      const targets = body || [
        {
          Id: instanceId,
          Port: port
        }
      ];

      return targetGroupModule.registerTargets(targetGroupArn, targets)
        .then(registerResponse => {
        return targetGroupModule.getTargetsHealth(targetGroupArn, targets)
          .then(targetGroupResponse => {
          const response = {
            statusCode: 200,
            body: targetGroupResponse
          };
          callback(null, response);
          return promise.resolve(response);           
        })       
      });
    }, event, context, callback);
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
    path: '/:targetGroupArn',
    handler: describeGroupHealthHandler
  },
  {
    method: 'DELETE',
    path: '/:targetGroupArn',
    handler: deregisterTargets
  },
  {
    method: 'DELETE',
    path: '/:targetGroupArn/:instanceId',
    handler: deregisterTargets
  },
  {
    method: 'DELETE',
    path: '/:targetGroupArn/:instanceId/:port',
    handler: deregisterTargets
  },  
  {
    method: 'POST',
    path: '/:targetGroupArn',
    handler: registerTargets
  },
  {
    method: 'POST',
    path: '/:targetGroupArn/:instanceId',
    handler: registerTargets
  },
  {
    method: 'POST',
    path: '/:targetGroupArn/:instanceId/:port',
    handler: registerTargets
  }
];

const httpRouter		    = require('aws-lambda-http-router').create(routes);
/*********************************************************************************/


exports.handler = httpRouter.handler;
