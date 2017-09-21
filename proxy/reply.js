var AV 		= require('leanengine'),
	debug 	= require('debug')('proxy:user');

var className = 'reply';
var adClass = AV.Object.extend(className);

/*****
var ReplySchema = new Schema({
  content: { type: String },
  topic_id: { type: ObjectId},
  author_id: { type: ObjectId },
  reply_id: { type: ObjectId },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  content_is_html: { type: Boolean },
  ups: [Schema.Types.ObjectId],
  deleted: {type: Boolean, default: false},
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
 * @param {String} content 回复内容
 * @param {String} topicId 主题ID
 * @param {String} authorId 回复作者
 * @param {String} [replyId] 回复ID，当二级回复时设定该值
 * @param {Object} 存储文章 回调函数
 */
exports.newAndSave = function (content, topicId, authorId, replyId) {
	let reply = new adClass();
	reply.set('content', content)
	reply.set('topic_id', topicId)
	reply.set('author_id', author_id)
	if(replyId) reply.set('replyId', replyId)
	return reply.save();
};
