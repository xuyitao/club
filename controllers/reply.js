
var AV 			= require('leanengine'),
	comFunc 	= require('../common'),
	Reply 		= require('../proxy/reply'),
	Topic 		= require('../proxy/topic'),
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
	console.log(11111111);
	debug(`reply create topicId =${topicId}`)
	topic.getById(topicId).then(function (topic) {
		//得到文章
		console.log(topic);
		if(!topic) {
			return AV.Promise.reject('此话题不存在或已被删除。')
		}
		user.set('score', (user.get('score') + 5));
		user.set('reply_count', (user.get('reply_count') + 1));
		user.save();

		return Reply.newAndSave(content, topicId, user, reply_id).then(function (reply) {
			return Topic.updateLastReply(topic, reply);
		}).then(function () {
			var newContent = content.replace('@' + topicAuthor.loginname + ' ', '');
        	return at.sendMessageToMentionUsers(newContent, topic_id, req.session.user._id, reply._id);
		}).then(function () {
			if (topic.author_id.toString() !== user.getObjectId()) {
		        message.sendReplyMessage(topic.author_id, user, topic._id, reply._id);
		    }
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
