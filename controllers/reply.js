
var AV 			= require('leanengine'),
	comFunc 	= require('../common'),
	Reply 		= require('../proxy/reply'),
	Topic 		= require('../proxy/topic'),
	Message		= require('../common/message'),
	at          = require('../common/at'),
	debug 		= require('debug')('controller:sign'),
	validator 	= require('validator');

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.create = function (req, res, next) {
	let content = validator.trim(req.body.t_content);
	let topicId = req.body.topicId;
	let reply_id = req.body.reply_id;
	let user = req.currentUser;
	debug(`reply create topicId =${topicId}`)
	Topic.getById(topicId).then(function (topic) {
		//得到文章
		if(!topic) {
			return AV.Promise.reject('此话题不存在或已被删除。')
		}
		user.set('score', (user.get('score') + 5));
		user.set('reply_count', (user.get('reply_count') + 1));
		user.save();
		return Reply.newAndSave(content, topic, user, reply_id).then(function (reply) {
			topic.set('last_reply', Reply.createPoint(reply.getObjectId()));
			topic.set('last_reply_at', new Date());
			topic.set('reply_count',(topic.get('reply_count')+1));
			return topic.save().then(function () {
				comFunc.respSuccessEx(true, req, res);
				var newContent = content.replace('@' + user.username + ' ', '');
				let authorObj = topic.get('author_id');
				at.sendMessageToMentionUsers(newContent, topic, user, reply);
				if (authorObj.getObjectId() !== 'user.getObjectId()') {
					return Message.sendReplyMessage(authorObj, user, topic, reply);
				}
			});
		})

	}).catch(function (err) {
		res.status(200).send(comFunc.respFail(err,req));
	})
}

exports.verify = function(req, res, next) {
  	if (req.currentUser) {
		res.status(200).send(comFunc.respSuccess(true, req));
  	} else {
	  	res.status(200).send(comFunc.respSuccess(false, req));
  	}
}
