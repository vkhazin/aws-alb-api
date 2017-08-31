process.env.config = JSON.stringify(require('../config/local-testing.json'));
const config 		          = (process.env.config)? JSON.parse(process.env.config): require('config');
const logger              = require('../logger').create(config);
const echoModule		      = require('../echo').create(config, logger);
const assert              = require('assert');

describe('echo', function() {
  
	describe('#echo', function() {
		it('Should return echo info', function(done) {
			echoModule.echo()
				.then(response => {
          assert(response.name, 'Empty response is not expected')
				})
				.done(function(){
					done();
				});
		});
	});
  
});