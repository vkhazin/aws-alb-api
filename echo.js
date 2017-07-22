'use strict';
const promise 		        = require('bluebird');
const appInfo             = require('./package.json');

exports.create =  function (config, logger) {

  return (function () {
    return {
      echo: function() {
        return promise.resolve ({
          name: appInfo.name,
          version: appInfo.version,
          description: appInfo.description,
          author: appInfo.author,
          node: process.version
        });
      }
    };
  }());
};