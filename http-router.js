'use strict';
const pathMatch         = require('path-match')();

exports.create =  function (routes) {

  //Create collection of RegExps
  const routesWithRegExp = routes.map(route => {
      route.pathRegExp = pathMatch(route.path);
      return route;
  });

  const filterByMethod = (routes, method) => {
    const methodLowerCase = method.toLowerCase();
    const filteredRoutes = routes.filter(route => route.method.toLowerCase() === methodLowerCase);
    return filteredRoutes;
  };

  const filterByPath = (routes, path) => {
    const filteredRoutes = routes.filter(route => route.pathRegExp(path) !== false);
    return filteredRoutes;
  };
  
  const response404 = (event, context, callback) => {
    const response = {
      statusCode: 404,
      body: `No route found for method: [${event.httpMethod}] and route: [${event.path}]`
    };
    callback(null, response);
    return Promise.resolve(response);
  };

  const responseMultiple = (event, context, callback) => {
    const response = {
      statusCode: 500,
      body: `Multiple routes found for method: [${event.httpMethod}] and route: [${event.path}]`
    };
    callback(null, response);
    return Promise.resolve(response);
  };
    
  const handler = (event, context, callback) => {
    const filteredByMethod = filterByMethod(routesWithRegExp, event.httpMethod);
    const filteredByPath = filterByPath(filteredByMethod, event.path);

    if (filteredByPath.length == 0) {
      return response404(event, context, callback);
    } else if (filteredByPath.length > 1) {
      return responseMultiple(event, context, callback);
    } else {
      return filteredByPath[0].handler(event, context, callback);
    }
  };
  
  return (function () {
    return {      
      handler: handler
    };
  }());
};