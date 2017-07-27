const promise 		        = require('bluebird');

exports.create =  function (config, logger) {

  function NotAuthenticated(message) {
      this.message = message;
      this.name = "NotAuthenticated";
      Error.captureStackTrace(this, NotAuthenticated);
  }

  NotAuthenticated.prototype = Object.create(Error.prototype);
  NotAuthenticated.prototype.constructor = NotAuthenticated;

  function NotAuthorized(message) {
      this.message = message;
      this.name = "NotAuthorized";
      Error.captureStackTrace(this, NotAuthorized);
  }

  NotAuthorized.prototype = Object.create(Error.prototype);
  NotAuthorized.prototype.constructor = NotAuthorized;
  
  const authenticate = (apiKey) => {
    const filteredKeys = config.auth.apiKeys.filter(_ => _.apiKey === apiKey);
    if (filteredKeys.length > 0) {
      const roles = filteredKeys.map(apiKey => apiKey.roles)
                    .reduce((left, right) => left.concat(right), []);
      return promise.resolve(roles);          
    } else {
      return promise.reject(new NotAuthenticated({ error: 'ApiKey invalid or is missing'}));
    }
  };

  const authorize = (roles, targetGroupArn) => {
    const filteredRoles = config.auth.roles.filter(role => roles.indexOf(role.role) > -1);
    const groupArns = filteredRoles.map(role => role.targetGroupArns)
                      .reduce((left, right) => left.concat(right), []);
    if (groupArns.indexOf(targetGroupArn) > -1 ) {
      return promise.resolve(true);
    } else {
      return promise.reject(new NotAuthorized({ error: 'ApiKey is not authorized for targetGroup: ' + targetGroupArn}));
    }
  };
  
  return (function () {
    return {
      
      authCZ: (apiKey, targetGroupArn) => {
        return authenticate(apiKey)
          .then(roles => {
            return authorize(roles, targetGroupArn);
          })
      },
      
      authenticate: authenticate,
      authorize: authorize,
      NotAuthenticated: NotAuthenticated,
      NotAuthorized: NotAuthorized
    };
  }());
};