var request = require('supertest');
var app = require('../app');
var config = require('../config');

describe('test/app.test.js', function () {
	it('should /status 200', function (done) {
		request(app).get('/').expect(200).expect(function (res) {
			if (res.text.indexOf(config.description) == -1) throw new Error('not contain description')
		}).end(done)
	})

})


describe('test hook', function () {
	it('it', function (done) {
		console.log('it');
		done()
	})

	before(function() {
    	// runs before all tests in this block
		console.log('before');
  	});

  	after(function() {
    	// runs after all tests in this block
		console.log('after');
  	});

  	beforeEach(function() {
    	// runs before each test in this block
		console.log('beforeEach');
  	});

  	afterEach(function() {
    	// runs after each test in this block
		console.log('afterEach');

  	});
})
