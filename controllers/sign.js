
var AV = require('leanengine'),
	comFunc = require('../common'),
	validator = require('validator');

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function (req, res, next) {
	var username = validator.trim(req.body.username)
	var password = validator.trim(req.body.password)
	
	AV.User.logIn(username, req.body.password).then(function(user) {

		res.saveCurrentUser(user); // 保存当前用户到 Cookie.
		res.status(200).send(comFunc.respSuccess(user ,req.body.id));

	 }, function(error) {
		res.status(200).send(comFunc.respFail(error, req.body.id));
	});
}
