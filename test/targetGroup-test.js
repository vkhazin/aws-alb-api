process.env.config = JSON.stringify(require('../config/local-testing.json'));
const config 		          = (process.env.config)? JSON.parse(process.env.config): require('config');
const logger              = require('../logger').create(config);
const assert              = require('assert');
const targetGroup		      = require('../targetGroup').create(config, logger);

const targetGroupArn = 'arn:aws:elasticloadbalancing:us-east-2:811322200214:targetgroup/smith-poc-nodejs-restart-tg/7c25fe0e5ca71022';
const instanceId1 = 'i-0b314f9c31a99621c';
const instanceId2 = 'i-019ebfaf92631c228';

describe('targetGroup', function() {
  
  it('GetTargetsHealth', function(done) {
    targetGroup.getTargetsHealth(targetGroupArn)
      .then(response => {
        console.log(JSON.stringify(response))
        assert.notEqual(response.length, 0, 'Empty response is not expected');
      })
      .done(function(){
        done();
    });
  });

  it('GetTargetsHealth - invalid group arn', function(done) {
    targetGroup.getTargetsHealth(targetGroupArn + 'bad')
      .then(response => {
        console.log(JSON.stringify(response))
        assert(response);
      })
      .catch(err => {
        console.error(JSON.stringify(err))
        assert(err);        
      })
      .done(function(){
        done();
    });
  });
  
  it('Deregister Targets', function(done) {
    const targets = [
      {
        Id: instanceId1
      }
    ];
    targetGroup.deregisterTargets(targetGroupArn, targets)
      .then(response => {
        console.log(JSON.stringify(response))
        assert(response);
      })
      .done(function(){
        done();
    });
  });
  
  it('Register Targets', function(done) {
    const targets = [
      {
        Id: instanceId1
      }
    ];
    targetGroup.registerTargets(targetGroupArn, targets)
      .then(response => {
        console.log(JSON.stringify(response))
        assert(response);
      })
      .done(function(){
        done();
    });
  });
  
});