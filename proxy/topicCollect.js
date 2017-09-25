var AV 		= require('leanengine'),
	debug 	= require('debug')('proxy:user');

var className = 'topicCollect';
var adClass = AV.Object.extend(className);

/*****
var TopicCollectSchema = new Schema({
  user_id: { type: ObjectId },
  topic_id: { type: ObjectId },
  create_at: { type: Date, default: Date.now }
});

***/

/**
 * 根据文章id查找所有回复
 * @param {String} topicId 文章id
 * @return {Object} 用户名数组
 */
exports.getByTopicId = function (topicId) {
	debug(`getByTopicId topicId=${topicId}`)
	return new AV.Promise(function(resolve,reject) {
		var query = new AV.Query(className);
		query.equalTo('topic_id', topicId)
		query.include('author_id');
		query.find().then(resolve).catch(reject)
	});

}


/**
 * 创建并保存一条回复信息
 * @param {String} topicId 主题ID
 * @param {String} authorId 回复作者
 * @param {Object} 存储文章 回调函数
 */
exports.newAndSave = function (userId, topicId) {

	let reply = new adClass();
	reply.set('topic_id', topicId)
	reply.set('user_id', userId)
	return reply.save();
};

exports.getById = function (userId, topicId) {
	var query = new AV.Query(className);
	query.equalTo('topic_id', topicId)
	query.equalTo('user_id', userId)
	return query.first()
}

exports.remove = function (userId, topicId) {
	var query = new AV.Query(className);
	query.equalTo('topic_id', topicId)
	query.equalTo('user_id', userId)
	return query.first().then(function (item) {
		if(item) {
			return item.destroy();
		}
	})
}

/**
 * 创建并保存一条回复信息
 * @param {String} replyId 回复内容
 * @return {Porint} 存储文章 回调函数
 */
exports.createPoint = function (replyId) {
	return AV.Object.createWithoutData(className, replyId)
};
