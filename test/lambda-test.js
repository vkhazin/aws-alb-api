process.env.config = JSON.stringify(require('../config/local-testing.json'));
const lambda		    = require('../lambda');
const assert        = require('assert');

const context = {
  succeed: (data) => {
    console.log(data);
  },
  fail: (err) => {
    console.error(err);
  }
};

const callback = (err, result) => {
  console.log('Lambda Callback(err, result):');
  console.log('result: ', result);
  console.error('err: ', err);
};

const echoEvent = require('./data/echoEvent.json');
const targetGroupArn = 'arn:aws:elasticloadbalancing:us-east-2:811322200214:targetgroup/smith-poc-nodejs-restart-tg/7c25fe0e5ca71022';
const instanceId1 = 'i-0b314f9c31a99621c';
const instanceId2 = 'i-019ebfaf92631c228';
const port = 3000;
      
describe('lambda', function() {
  
	describe('#Bad Route', function() {
		it('Should return 404', function(done) {
      
      const event = {
        "resource": "/",
        "path": "/aaa/bbb/ccc",
        "httpMethod": "GET",
        "body": null,
        "headers": {
          "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }
      };
      
			lambda.handler(event, context, callback)
				.then(function(response){
          assert.equal(response.statusCode, 404, 'Status code should be equal 404');
          done();
				})
				.catch(() => {
					done();
				});
		});
	});
  
	describe('#echo', function() {
		it('Should return echo info', function(done) {
			lambda.handler(echoEvent, context, callback)
				.then(function(response){
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
          assert.equal(typeof(response.body), 'string', 'Body must be string - not json');
				})
				.done(function(){
					done();
				});
		});
	});

	describe('#getTargetHealth - success', function() {
    
		it('Should return target health info', function(done) {
      const event = {
        "resource": "/",
        "path": "/" + encodeURIComponent(targetGroupArn),
        "httpMethod": "GET",
        "body": null,
        "headers": {
          "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }
      };
      
			lambda.handler(event, context, callback)
				.then(function(response){
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
				})
        .catch(err => {
          console.error(err);
          assert.fail(err);
        })
				.done(function(){
					done();
				});
		});

		it('Should return 401', function(done) {      
      const event = {
        "resource": "/",
        "path": "/" + encodeURIComponent(targetGroupArn),
        "httpMethod": "GET",
        "body": null,
        "headers": {
          "x-api-key": "aaa"
        }
      };
      
			lambda.handler(event, context, callback)
				.then(function(response){
          assert.equal(response.statusCode, 401, 'Status code should be equal 401');
				})
        .catch(err => {
          console.error(err);
          assert.fail(err);
        })
				.done(function(){
					done();
				});
		});

		it('Should return 403', function(done) {
      
      const event = {
        "resource": "/",
        "path": "/" + encodeURIComponent(targetGroupArn + 'something different'),
        "httpMethod": "GET",
        "body": null,
        "headers": {
         "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }
      };
      
			lambda.handler(event, context, callback)
				.then(function(response){
          assert.equal(response.statusCode, 403, 'Status code should be equal 403');
				})
        .catch(err => {
          console.error(err);
          assert.fail(err);
        })
				.done(function(){
					done();
				});
		});
    
		it('Should throw 500 error', function(done) {
      const event = {
        "resource": "/",
        "path": "/" + encodeURIComponent('bad-arn'),
        "httpMethod": "GET",
        "body": null,
        "headers": {
          "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }
      };
      
			lambda.handler(event, context, callback)
				.then(function(response){
          assert.equal(response.statusCode, 500, 'Status code should be equal 500');
				})
				.done(function(){
					done();
				});
		});
		
	});
  
  describe('#deregisterTargets', function() {
    
		it('De-Register by Url', function(done) {
      const event = {
        "resource": "/",
        "path": "/" + encodeURIComponent(targetGroupArn) + "/" + encodeURIComponent(instanceId1),
        "httpMethod": "DELETE",
        "body": null,
        "headers": {
          "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }
      }; 
			lambda.handler(event, context, callback)
				.then((response) => {
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
				})
				.done(function(){
					done();
				});
		});

		it('De-Register by Url - NotAuthenticated', function(done) {
      //Bad instances id does not causes an error from aws-cli :-(
      const event = {
        "resource": "/",
        "path": "/" + encodeURIComponent(targetGroupArn) + "/" + encodeURIComponent(instanceId1),
        "httpMethod": "DELETE",
        "body": null,
        "headers": {
          "x-api-key": "aaa"
        }
      };
			lambda.handler(event, context, callback)
				.then((response) => {
          assert.equal(response.statusCode, 401, 'Status code should be equal 401');
				})
				.done(function(){
					done();
				});
		});
 
 		it('De-Register by Url - NotAuthorized', function(done) {
      //Bad instances id does not causes an error from aws-cli :-(
      const event = {
        "resource": "/",
        "path": "/" + 'not-authorized' + "/" + encodeURIComponent(instanceId1),
        "httpMethod": "DELETE",
        "body": null,
        "headers": {
          "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }
      };   
			lambda.handler(event, context, callback)
				.then((response) => {
          assert.equal(response.statusCode, 403, 'Status code should be equal 403');
				})
				.done(function(){
					done();
				});
		});
    
		it('De-Register by Url - invalid group arn', function(done) {
      //Bad instances id does not causes an error from aws-cli :-(
      const event = {
        "resource": "/",
        "path": "/" + 'bad-arn' + "/" + encodeURIComponent(instanceId1),
        "httpMethod": "DELETE",
        "body": null,
        "headers": {
          "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }
      };
      
			lambda.handler(event, context, callback)
				.then((response) => {
          assert.equal(response.statusCode, 500, 'Status code should be equal 500');
				})
				.done(function(){
					done();
				});
		});
    
		it('De-Register by Url + Port', function(done) {
      const event = {
        "resource": "/",
        "path": "/" + encodeURIComponent(targetGroupArn) + "/" + encodeURIComponent(instanceId1) + "/" + port,
        "httpMethod": "DELETE",
        "body": null,
        "headers": {
          "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }
      };
      
			lambda.handler(event, context, callback)
				.then((response) => {
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
				})
				.done(function(){
					done();
				});
		});

    it('De-Register by Body', function(done) {
      const body = [
        {
          Id: instanceId1
        },
        {
          Id: instanceId2,
          Port: port
        }
      ];

      const event = {
        "resource": "/",
        "path": "/" + encodeURIComponent(targetGroupArn),
        "httpMethod": "DELETE",
        "body": JSON.stringify(body),
        "headers": {
          "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }
      };
      
			lambda.handler(event, context, callback)
				.then((response) => {
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
				})
				.done(function(){
					done();
				});
		});
	});
  
  describe('#registerTargets', function() {
    
		it('Register by Url', function(done) {
      const event = {
        "resource": "/",
        "path": "/" + encodeURIComponent(targetGroupArn) + "/" + encodeURIComponent(instanceId1),
        "httpMethod": "POST",
        "body": null,
        "headers": {
          "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }        
      };     
			lambda.handler(event, context, callback)
				.then((response) => {
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
				})
				.done(function(){
					done();
				});
		});

		it('Register by Url - NotAuthenticated', function(done) {
      //Bad instances id does not causes an error from aws-cli :-(
      const event = {
        "resource": "/",
        "path": "/" + encodeURIComponent(targetGroupArn) + "/" + encodeURIComponent(instanceId1),
        "httpMethod": "POST",
        "body": null,
        "headers": {
          "x-api-key": "aaa"
        }
      };
			lambda.handler(event, context, callback)
				.then((response) => {
          assert.equal(response.statusCode, 401, 'Status code should be equal 401');
				})
				.done(function(){
					done();
				});
		});

 		it('Register by Url - NotAuthorized', function(done) {
      //Bad instances id does not causes an error from aws-cli :-(
      const event = {
        "resource": "/",
        "path": "/" + 'not-authorized' + "/" + encodeURIComponent(instanceId1),
        "httpMethod": "POST",
        "body": null,
        "headers": {
          "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }
      };   
			lambda.handler(event, context, callback)
				.then((response) => {
          assert.equal(response.statusCode, 403, 'Status code should be equal 403');
				})
				.done(function(){
					done();
				});
		});
		    
		it('Register by Url - invalid input', function(done) {
      const event = {
        "resource": "/",
        "path": "/" + encodeURIComponent(targetGroupArn) + "/" + encodeURIComponent(instanceId1 + 'bad'),
        "httpMethod": "POST",
        "body": null,
        "headers": {
          "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }      
      };    
			lambda.handler(event, context, callback)
				.then((response) => {
          assert.equal(response.statusCode, 500, 'Status code should be equal 500');
				})
				.done(function(){
					done();
				});
		});
  
    it('Register by Url + Port', function(done) {
      const event = {
        "resource": "/",
        "path": "/" + encodeURIComponent(targetGroupArn) + "/" + encodeURIComponent(instanceId1) + "/" + port,
        "httpMethod": "POST",
        "body": null,
        "headers": {
          "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }      
      };  
			lambda.handler(event, context, callback)
				.then((response) => {
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
				})
				.done(function(){
					done();
				});
		});

    it('Register by Body', function(done) {
      const body = [
        {
          Id: instanceId1
        },
        {
          Id: instanceId2,
          Port: port
        }
      ];
      const event = {
        "resource": "/",
        "path": "/" + encodeURIComponent(targetGroupArn),
        "httpMethod": "POST",
        "body": JSON.stringify(body),
        "headers": {
          "x-api-key": "29ed67a1-0818-442c-9729-6a342998872c"
        }      
      };    
			lambda.handler(event, context, callback)
				.then((response) => {
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
				})
				.done(function(){
					done();
				});
		});
   
	});  

});