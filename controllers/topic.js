
var AV = require('leanengine'),
	comFunc = require('../common'),
	topic = require('../proxy/topic'),
	validator = require('validator');

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
	let topicId = validator.trim(req.body.topicId);
	let user = req.currentUser;
	// let authorId = user.getObjectId();

	topic.newAndSave(title, content, tab, user, topicId).then(function (topicObj) {
		user.set('score', (user.get('score') + 5));
		if(topicId) {
			user.set('topic_count', (user.get('topic_count') + 1));
		}
		return user.save().then(function () {
			return at.sendMessageToMentionUsers(content, topicObj, user);
		}).then(function () {
			res.status(200).send(comFunc.respSuccess(topicObj.getObjectId(),req));
		});
	}).catch(function (err) {
		res.status(200).send(comFunc.respFail(err,req));
	})

}
