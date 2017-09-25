
var AV 			= require('leanengine'),
	comFunc 	= require('../common'),
	topic 		= require('../proxy/topic'),
	at          = require('../common/at'),
	reply 		= require('../proxy/reply'),
	Collect   = require('../proxy/topicCollect')
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
				let user = req.currentUser;
				if(user) {
					return Collect.getById(user, topic).then(function (collect) {
						res.status(200).send(comFunc.respSuccess({
							topic:topic,
							replies:replies,
							linkContent:linkContent,
							isCollect : collect?true:false
						},req));
					})
				} else {
					res.status(200).send(comFunc.respSuccess({
						topic:topic,
						replies:replies,
						linkContent:linkContent
					},req));
				}
			})
		} else {
			return AV.Promise.reject('此话题不存在或已被删除。')
		}

	}).catch(function (err) {
		res.status(200).send(comFunc.respFail(err,req));
	})
}


exports.getUnReplyTopic = function (req, res, next) {
	topic.getUnReplyTopic().then(function (topics) {
		comFunc.respSuccessEx(topics, req, res)
	}).catch(function (err) {
		res.status(200).send(comFunc.respFail(err,req));
	})
}

exports.delete = function (req, res, next) {
	let topicId = req.body.topicId;
	if(!topicId) {
		return res.status(200).send(comFunc.respFail(new Error('此话题不存在'),req));
	}
	topic.delete(topicId).then(function (result) {
		comFunc.respSuccessEx(result, req, res)
	}).catch(function (err) {
		res.status(200).send(comFunc.respFail(err,req));
	})
}


exports.collect = function (req, res, next) {
	let topicId = req.body.topicId;
	let user = req.currentUser;
	if(!topicId) {
		return res.status(200).send(comFunc.respFail(new Error('此话题不存在'),req));
	}

	topic.getById(topicId).then(function (topic) {
		return Collect.getById(user, topic).then(function (collect) {
			if(collect) {
				return true
			}

			return Collect.newAndSave(user, topic).then(function (collect) {
				if(collect) {
					topic.collect_count += 1;
					topic.set('collect_count',(topic.get('collect_count')+ 1));
					topic.save()
					user.set('collect_topic_count',(user.get('collect_topic_count')+ 1));
					user.save()
				}
			})
		}).then(function () {
			comFunc.respSuccessEx(true, req, res)
		})
	}).catch(function (err) {
		res.status(200).send(comFunc.respFail(err,req));
	})
}


exports.decollect = function (req, res, next) {
	let topicId = req.body.topicId;
	let user = req.currentUser;
	if(!topicId) {
		return res.status(200).send(comFunc.respFail(new Error('此话题不存在'),req));
	}
	topic.getById(topicId).then(function (topic) {
		return Collect.getById(user, topic).then(function (collect) {
			if(collect) {
				return Collect.remove(user, topic).then(function (collect) {
					if(collect) {
						topic.set('collect_count',(topic.get('collect_count')-1));
						topic.save()
						user.set('collect_topic_count',(user.get('collect_topic_count')-1));
						user.save()
					}
				})
			} else {
				return true
			}
		}).then(function () {
			comFunc.respSuccessEx(true, req, res)
		})


	}).catch(function (err) {
		res.status(200).send(comFunc.respFail(err,req));
	})
}
