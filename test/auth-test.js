process.env.config = JSON.stringify(require('../config/local-testing.json'));
const config 		          = (process.env.config)? JSON.parse(process.env.config): require('config');
const logger              = require('../logger').create(config);
const assert              = require('assert');
const auth		            = require('../auth').create(config, logger);

const apiKey = '29ed67a1-0818-442c-9729-6a342998872c';
const role = 'smith-poc-alb-api';
const targetGroupArn = 'arn:aws:elasticloadbalancing:us-east-2:811322200214:targetgroup/smith-poc-nodejs-restart-tg/7c25fe0e5ca71022';

describe('auth', function() {
  
  it('authC - success', function(done) {
    auth.authenticate(apiKey)
      .then(response => {
        assert(response);
      })
      .done(function(){
        done();
    });
  });

  it('authC - failure', function(done) {
    auth.authenticate(apiKey + 'bad')
      .then(response => {
//         console.log('No catch')
        assert.fail(response);
      })
      .catch(auth.NotAuthenticated, err => {
//         console.log('NotAuthenticated:', JSON.stringify(err));
        assert(err.message.error);
      })
      .catch(err => {
        console.error('Unexpected catch');
        console.error(err);
        assert.fail(err);
      })
      .done(function(){
        done();
    });
  });
  
  it('authZ - success', function(done) {
    auth.authorize([role], targetGroupArn)
      .then(response => {
        assert(response);
      })
      .catch(err => {
//         console.log(JSON.stringify(err))
        assert(err);
      })
      .done(function(){
        done();
    });
  });

  it('authZ - failure', function(done) {
    auth.authorize(['bad role name'], targetGroupArn)
      .then(response => {
//         console.error(response);
        assert.fail(response);
      })
      .catch(auth.NotAuthorized, err => {
//         console.log('NotAuthorized:', JSON.stringify(err));
        assert(err.message.error);
      })    
      .catch(err => {
        assert.fail(`Unexpected catch: ${JSON.stringify(err)}`);
      })
      .done(function(){
        done();
    });
  });  
  
  it('authCZ - success', function(done) {
    auth.authenticate(apiKey, targetGroupArn)
      .then(response => {
        assert(response);
      })
      .done(function(){
        done();
    });
  });  

  it('authCZ - authC failure', function(done) {
    auth.authenticate('bad key', targetGroupArn)
      .then(response => {
        assert(response);
      })
      .catch(auth.NotAuthenticated, err => {
//         console.log('NotAuthenticated:', JSON.stringify(err));
        assert(err.message.error);
      })
      .catch(err => {
        console.error('Unexpected catch');
        console.error(err);
        assert.fail(err);
      })
      .done(function(){
        done();
    });
  });

  it('authCZ - authZ failure', function(done) {
    auth.authenticate(apiKey, 'bad target group arn')
      .then(response => {
        assert(response);
      })
      .catch(auth.NotAuthorized, err => {
//         console.log('NotAuthorized:', JSON.stringify(err));
        assert(err.message.error);
      })    
      .catch(err => {
        assert.fail(`Unexpected catch: ${JSON.stringify(err)}`);
      })
      .done(function(){
        done();
    });
  });
  
});