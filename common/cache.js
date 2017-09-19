var redis = require('./redis');


exports.get = function (key) {
	return redis.get(key).then(function (value) {
		if(value) {
			return JSON.parse(value)
		} else {
			return value
		}
	})
}


exports.set = function (key, value, time) {
	if(value) value = JSON.stringify(value)
	return redis.set(key, value,time);
}
