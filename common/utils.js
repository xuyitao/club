var debug = require('debug')('common:utils');


exports.respSuccess = function (data, req) {
	return {
		result:data,
		error:null,
		id:req.body.id
	}
}

exports.respFail = function (err, req) {
	console.log(err);
	return {
		result:null,
		error:err.message,
		id:req.body.id
	}
}
