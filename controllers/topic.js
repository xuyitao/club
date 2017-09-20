
var AV 			= require('leanengine'),
	comFunc 	= require('../common'),
	topic 		= require('../proxy/topic'),
	at          = require('../common/at');
	validator 	= require('validator');

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.put = function (req, res, next) {
	let title   = validator.trim(req.body.title);
    let tab     = validator.trim(req.body.tab);
    let content = validator.trim(req.body.t_content);
	let topicId = req.body.topicId;
	let user = req.currentUser;
	// let authorId = user.getObjectId();

	topic.newAndSave(title, content, tab, user, topicId).then(function (topicObj) {
		user.set('score', (user.get('score') + 5));
		if(topicId) {
			user.set('topic_count', (user.get('topic_count') + 1));
		}
		return user.save().then(function () {
			at.sendMessageToMentionUsers(content, topicObj, user);
			res.status(200).send(comFunc.respSuccess(topicObj.getObjectId(),req));
		});
	}).catch(function (err) {
		res.status(200).send(comFunc.respFail(err,req));
	})

}

exports.getByPage = function (req, res, next) {
	let page   = req.body.page || 0;
	let size   = req.body.size || 10;
	let tab     = validator.trim(req.body.tab);
	topic.getByPage(tab, page, size).then(function (obj) {
		res.status(200).send(comFunc.respSuccess(obj,req));
	}).catch(function () {
		res.status(200).send(comFunc.respFail(err,req));
	})
}

exports.show = function (req, res, next) {
	
	let topicId = req.body.topicId;
	topic.getById(topicId).then(function (topic) {
		res.status(200).send(comFunc.respSuccess(obj,req));
	}).catch(function () {
		res.status(200).send(comFunc.respFail(err,req));
	})
}
