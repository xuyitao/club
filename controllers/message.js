
var AV 			= require('leanengine'),
	comFunc 	= require('../common'),
	Reply 		= require('../proxy/reply'),
	Topic 		= require('../proxy/topic'),
	Message		= require('../proxy/message'),
	at          = require('../common/at'),
	debug 		= require('debug')('controller:sign'),
	validator 	= require('validator');



/**
 * 用户未读消息
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.unReadMsg = function (req, res, next) {
	let user = req.currentUser;

	Message.getMsgCount(user).then(function (count) {
		comFunc.respSuccessEx(count,req,res)
	}).then(function (err) {
		res.status(200).send(comFunc.respFail(err,req));
	})
}
