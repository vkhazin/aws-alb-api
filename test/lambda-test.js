process.env.config = JSON.stringify(require('../config/local-testing.json'));
const lambda = require('../lambda');
const assert = require('assert');

const helloWorldBase64 = 'SGVsbG8gV29ybGQh';

const context = {
  succeed: (data) => {
    console.log(data);
  },
  fail: (err) => {
    console.error(err);
  }
};

const callback = (err, result) => {
  if (!err) {
    return;
  }
  console.log('Lambda Callback(err, result):');
  console.log('result:', result);
  console.error('err:', err);
};

describe('lambda', function () {

  describe('file', function () {

    it('Should return metadata when file is stored', function (done) {
      const data = {
        metadata: [
          {
            key: 'value1'
          }, {
            key: 'value2'
          }
        ],
        content: helloWorldBase64
      };
      const event = {
        httpMethod: 'POST',
        path: '/test/hello-world',
        body: JSON.stringify(data)
      };

      lambda
        .handler(event, context, callback)
        .then(function (response) {
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
          assert.equal(typeof(response.body), 'string', 'Body must be a string');
          const result = JSON.parse(response.body);
          assert.equal(result.metadata.length, data.metadata.length, 'Metadata have same number of keys');
          assert.equal(result.metadata[0].key, data.metadata[0].key, 'Metadata 0 must be correct');
          assert.equal(result.metadata[1].key, data.metadata[1].key, 'Metadata 1 must be correct');
        })
        .done(done);
    });

    it('Should return a list of files', function (done) {
      const event = {
        httpMethod: 'GET',
        path: '/test',
        queryStringParameters: {
          from: 0,
          size: 10
        }
      };

      lambda
        .handler(event, context, callback)
        .then(function (response) {
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
          assert.equal(typeof(response.body), 'string', 'Body must be a string');
          const result = JSON.parse(response.body);
          assert(result.length > 0, 'Should not return empty array');
        })
        .done(done);
    });

    it('Should return file info when fetched', function (done) {
      const event = {
        httpMethod: 'GET',
        path: '/test/hello-world'
      };

      lambda
        .handler(event, context, callback)
        .then(function (response) {
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
          assert.equal(typeof(response.body), 'string', 'Body must be a string');
          const result = JSON.parse(response.body);
          assert.equal(result.content, helloWorldBase64, 'Content must be correct');
          assert.equal(result.metadata.length, 2, 'Metadata must have 2 properties');
        })
        .done(done);
    });

    it('Should return 200 when file is deleted', function (done) {
      const event = {
        httpMethod: 'DELETE',
        path: '/test/hello-world'
      };

      lambda
        .handler(event, context, callback)
        .then(function (response) {
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
          assert(response.body == null, 'Body must be null');
        })
        .done(done);
    });

    it('Should not return 200 for missing file', function (done) {
      const event = {
        httpMethod: 'GET',
        path: '/test/hello-world'
      };

      lambda
        .handler(event, context, callback)
        .then(function (response) {
          assert.notEqual(response.statusCode, 200, 'Status code should not equal 200');
        })
        .done(done);
    });

  });

});