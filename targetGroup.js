const promise 		        = require('bluebird');

exports.create =  function (config, logger) {

  const elbv2               = promise.promisifyAll(new (require('aws-sdk')).ELBv2({apiVersion: '2015-12-01'}));
  
  return (function () {
    return {
      
      getTargetsHealth: (targetGroupArn, targets) => {
        return elbv2.describeTargetHealthAsync({
          TargetGroupArn: targetGroupArn,
          Targets: targets
        })
        .then(response => {
          return promise.resolve(response.TargetHealthDescriptions);
        })
      },

      registerTargets: (targetGroupArn, targets) => {
//       Using target group port and proto
//       Targets: [
//         {
//           Id: "i-80c8dd94"
//         }, 
//         {
//           Id: "i-ceddcd4d"
//         }
//       ]
//       
//         Override group port
//         Targets: [
//           {
//             Id: "i-80c8dd94", 
//             Port: 80
//           }, 
//           {
//             Id: "i-80c8dd94", 
//             Port: 766
//           }
//         ]

        return elbv2.registerTargetsAsync({
          TargetGroupArn: targetGroupArn, 
          Targets: targets
        })
        .then(response => {
          return promise.resolve(response);
        });
      },

      deregisterTargets: (targetGroupArn, targets) => {
//       Using target group port and proto
//       Targets: [
//         {
//           Id: "i-80c8dd94"
//         }, 
//         {
//           Id: "i-ceddcd4d"
//         }
//       ]
//       
//       Override group port
//       Targets: [
//       {
//        Id: "i-80c8dd94", 
//        Port: 80
//       }, 
//       {
//         Id: "i-80c8dd94", 
//         Port: 766
//       }
//     ]
        return elbv2.deregisterTargetsAsync({
          TargetGroupArn: targetGroupArn, 
          Targets: targets
        })
        .then(response => {
          return promise.resolve(response);
        });
      }        
      
    };
  }());
};