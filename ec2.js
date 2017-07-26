const promise 		        = require('bluebird');

exports.create =  function (config, logger) {
  const ec2               = promise.promisifyAll(new (require('aws-sdk')).EC2({apiVersion: '2016-11-15'}));
  
  return (function () {
    return {
      
      describeInstances: (istanceIds) => {
        return ec2.describeInstancesAsync({
          InstanceIds: istanceIds
        })
        .then(response => {
          return promise.resolve(response);
        })
      }

    };
  }());
};