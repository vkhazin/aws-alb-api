'use strict';
const promise = require('bluebird');

const repo = [];

exports.create = function (config, logger) {

  return (function () {
    return {

      store: function (path, data) {
        const idx = repo.findIndex(x => x.path == path);
        if (idx > -1) {
          repo.splice(idx, 1);
        }
        const response = {
          metadata: data.metadata,
          path: path
        };
        const file = {
          content: data.content,
          metadata: data.metadata,
          path: path
        };
        repo.push(file);
        return promise.resolve({metadata: data.metadata, path: path});
      },

      fetch: function (path) {
        const match = repo.filter(x => x.path == path);
        if (match.length) {
          return promise.resolve(match[0]);
        }
        return promise.reject(`No file found at "${path}"`);
      },

      list: function (path, from, size) {
        var page = repo.filter(x => x.path.indexOf(path) === 0).slice(from, size - from);
        return promise.resolve(page);
      },

      delete: function (path) {
        const idx = repo.findIndex(x => x.path == path);
        if (idx == -1) {
          return promise.reject(`No file found at "${path}"`);
        }
        repo.splice(idx, 1);
        return promise.resolve();
      }

    };
  }());
};
