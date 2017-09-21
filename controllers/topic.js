
var AV 			= require('leanengine'),
	comFunc 	= require('../common'),
	topic 		= require('../proxy/topic'),
	at          = require('../common/at'),
	reply 		= require('../proxy/reply'),
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

exports.getDetail = function (req, res, next) {

	let topicId = req.body.topicId;
	
	if(!topicId) {
		return res.status(200).send(comFunc.respFail(new Error('此话题不存在'),req));
	}
	topic.getById(topicId).then(function (topic) {
		if(topic) {
			let visit_count = topic.get('visit_count')+1;
			topic.set('visit_count',visit_count);
			topic.save();
			let linkContent = at.linkUsers(topic.get('content'))
			return reply.getByTopicId(topicId).then(function (replies) {
				res.status(200).send(comFunc.respSuccess({
					topic:topic,
					replies:replies,
					linkContent:linkContent
				},req));
			})
		} else {
			return AV.Promise.reject('此话题不存在或已被删除。')
		}

	}).catch(function (err) {
		res.status(200).send(comFunc.respFail(err,req));
	})
}
