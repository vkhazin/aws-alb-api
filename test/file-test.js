process.env.config = JSON.stringify(require('../config/local-testing.json'));
const config = (process.env.config)
		? JSON.parse(process.env.config)
		: require('config');
const logger = require('../logger').create(config);
const fileModule = require('../file-mock').create(config, logger);
const assert = require('assert');

const helloWorldBase64 = 'SGVsbG8gV29ybGQh';

describe('file', function () {

		describe('store', function () {
				it('Should add the file and return the stored file metadata', function (done) {
						const path = '/test/new-file';
						const data = {
								metadata: [
										{
												a: 1
										}, {
												b: 2
										}
								],
								content: helloWorldBase64
						};
						fileModule
								.store(path, data)
								.then(response => {
										assert.equal(response.metadata.a, data.metadata.a, 'File meta data is not correct');
										assert.equal(response.metadata.b, data.metadata.b, 'File meta data is not correct');
										assert.equal(response.path, path, 'File path is not correct');
								})
								.done(done);
				});
		});

		describe('list', function () {
				it('Should return correct number of files', function (done) {
						const path = '/test/foo';
						const data = {
								metadata: [],
								content: 'bar'
						};
						fileModule
								.store(path, data)
								.then(response => {
										assert.equal(response.path, path, 'File path is not correct');
								});
						fileModule
								.list('/test', 0, 10)
								.then(response => {
										assert.equal(response.length, 2, 'File list length is not correct');
								})
								.done(done);
				});
		});

		describe('fetch', function () {
				it('Should return the stored file metadata', function (done) {
						fileModule
								.fetch('/test/new-file')
								.then(response => {
										assert.equal(response.content, helloWorldBase64, 'File content is not correct');
								})
								.done(done);
				});

		});

});