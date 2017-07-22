'use strict';exports.create =  function (config) {
  if (config.log && config.log.level) {
    var logLevel = config.log.level;
  } else {
    var logLevel = 2; //Info
  }

  return (function () {
    return {
      trace: function (msg) {
        if (logLevel >= 3) {
          console.trace(msg);
        }
      },
      info: function (msg) {
        if (logLevel >= 2) {
          console.info(msg);
        }
      },
      log: function (msg) {
        if (logLevel >= 1) {
          console.log(msg);
        }
      },
      error: function (msg) {
        if (logLevel >= 0) {
          console.error(msg)
        }
      }
    };
  }());
};