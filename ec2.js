const promise 		        = require('bluebird');
const ec2                 = promise.promisifyAll(new (require('aws-sdk')).EC2({apiVersion: '2016-11-15'}));

exports.create =  function (config, logger) {
  
  return (function () {
    return {      
      describeInstances: (instanceIds) => {
        return ec2.describeInstancesAsync({
          InstanceIds: instanceIds
        })
        .then(ec2Info => {
          const instancesData = ec2Info.Reservations.map(reservation => 
              reservation.Instances.map(instance => 
                  instance
              )
          ).reduce((left, right) => left.concat(right), []);
          
          return promise.resolve(instancesData);
        });
      }
    };
  }());
};