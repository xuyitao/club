


exports.respSuccess = function (data, id) {
	return {
		result:data,
		error:null,
		id:id
	}
}

exports.respFail = function (err, id) {
	return {
		result:null,
		error:err,
		id:id
	}
}
