var cache = require('../../common/cache');
var should = require('should');


describe('test/common/cache.test.js', function () {
	it('should set && get', function (done) {
		if(process.env.NODE_ENV == 'test') {
			return done();
		}
		cache.set('testcache', {age:50}).then(function () {
			return cache.get('testcache')
		}).then(function (value) {
			value.should.eql({age: 50});
			done();
		})
	})

	it('should expire', function (done) {
		if(process.env.NODE_ENV == 'test') {
			return done();
		}
		cache.set('testexpire', {age:51}, 1).then(function () {
			setTimeout(function () {
				cache.get('testexpire').then(function (value) {
					should.not.exist(value)
					done()
				})
			}, 1.5*1000)
		})
	})
})
