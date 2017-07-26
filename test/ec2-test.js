const config 		          = require('config');
const logger              = require('../logger').create(config);
const assert              = require('assert');
const ec2		              = require('../ec2').create(config, logger);

const instanceId1 = 'i-0b314f9c31a99621c';
const instanceId2 = 'i-019ebfaf92631c228';

describe('ec2', function() {
  
  it('describe instances - success', function(done) {
    ec2.describeInstances([instanceId1, instanceId2])
      .then(response => {
        console.log(JSON.stringify(response))
        assert(response);
      })
      .done(function(){
        done();
    });
  });

  it('describe instances invalid instanceId', function(done) {
    ec2.describeInstances(['bad instance id'])
      .then(response => {
        console.log(JSON.stringify(response))
        assert(response);
      })
      .done(function(){
        done();
    });
  });
  
});