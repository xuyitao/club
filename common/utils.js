var debug 	= require('debug')('common:utils'),
	moment	= require('moment');


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

moment.locale('zh-cn'); // 使用中文

// 格式化时间
exports.formatDate = function (date, friendly) {
  	date = moment(date);

	if (friendly) {
		return date.fromNow();
	} else {
		return date.format('YYYY-MM-DD HH:mm');
	}

};
