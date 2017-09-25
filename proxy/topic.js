var AV = require('leanengine'),
	debug = require('debug')('proxy:topic');

var className = 'topic';
var adClass = AV.Object.extend(className);


/**
var TopicSchema = new Schema({
  title: { type: String },
  content: { type: String },
  author_id: { type: ObjectId },
  top: { type: Boolean, default: false }, // 置顶帖
  good: {type: Boolean, default: false}, // 精华帖
  lock: {type: Boolean, default: false}, // 被锁定主题
  reply_count: { type: Number, default: 0 },
  visit_count: { type: Number, default: 0 },
  collect_count: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  last_reply: { type: ObjectId },
  last_reply_at: { type: Date, default: Date.now },
  content_is_html: { type: Boolean },
  tab: {type: String},
  deleted: {type: Boolean, default: false},
});
**/

/**
 * 创建和更新文章
 * @param {String} title 标题
 * @param {String} content 文本内容
 * @param {String} tab 分类
 * @param {Type} authorId 作者id
 * @param {String} topicId 文章ID
 * @return {Object} 用户名数组
 */
var newAndSave = exports.newAndSave = function (title, content, tab, authorId, topicId) {
	debug(`newAndSave topicId=${topicId}`)
	return new AV.Promise(function(resolve,reject) {
		if(topicId) {
			var topic = new AV.Query(className);
			topic.equalTo('objectId', topicId)
			topic.first().then(function (item) {
				if(!item) {
					item = new adClass();
				}
				item.set('title', title)
				item.set('content', content)
				item.set('tab', tab)
				item.set('author_id', authorId)
				return item.save();
			}).then(resolve).catch(reject)
		} else {
			let item = new adClass();
			item.set('title', title)
			item.set('content', content)
			item.set('tab', tab)
			item.set('author_id', authorId)
			return item.save().then(resolve);
		}
	});

}
/**
 * 根据类别取分页数据
 * @param {String} tab 标题
 * @param {Number} page 文本内容
 * @param {Number} size 分类
 * @return {Object} 用户名数组
 */
exports.getByPage = function (tab, page, size) {
	debug(`getByPage tab=${tab} page=${page}`)
	return new AV.Promise(function(resolve,reject) {
		let resObj={};
		var query = new AV.Query(className);
		if(tab == 'all') {
			let ignoretab = ['job', 'dev'];
			query.notContainedIn('tab', ignoretab)
		} else if (tab == 'good'){
			query.equalTo('good', true)
		} else {
			query.equalTo('tab', tab)
		}
		query.notEqualTo('deleted', true)
		query.count().then(function (count) {
			resObj['total']=count;
			query.limit(size);
		    query.skip(size * page);
			query.include('author_id', 'last_reply', 'last_reply.author_id');
			return query.find()
		}).then(function (itemq) {
			resObj['data'] = itemq;
			resolve(resObj)
		}).catch(reject)
	});

}


/**
 * 根据类别取分页数据
 * @param {String} id 标题
 * @return {Object} 用户名数组
 */
exports.getById = function (id) {
	debug(`getById id=${id}`)
	var query = new AV.Query(className);
	query.equalTo('objectId',id)
	query.notEqualTo('deleted', true)
	query.include('author_id');
	return query.first()

}

/**
 * 更新主题的最后回复信息
 * @param {String} topicId 主题ID
 * @param {String} replyId 回复ID
 * @param {Function} callback 回调函数
 */
exports.updateLastReply = function (topicId, replyId) {
	var query = new AV.Query(className);
	query.equalTo('objectId',topicId)
	query.notEqualTo('deleted', true)
	return query.first().then(function (item) {
		if(!item) {
			return AV.Promise.reject(`找不到topicId=${topicId}的话题`)
		}else {
			item.set('last_reply', replyId);
			item.set('last_reply_at', new Date());
			let reply_count = item.get('reply_count')+1;
			item.set('reply_count', reply_count);
			return item.save()
		}
	})

};

/**
 * 更新主题的最后回复信息
 * @param {String} topicId 主题ID
 * @param {String} replyId 回复ID
 * @param {Function} callback 回调函数
 */
exports.getUnReplyTopic = function () {
	var query = new AV.Query(className);
	query.equalTo('last_reply', null)
	query.limit(5);
	query.notEqualTo('delete', true)
	query.descending('updatedAt')
	return query.find()

};

/**
 * 逻辑删除文章
 * @param {String} topicId 主题ID
 * @param {Function} callback 回调函数
 */
exports.delete = function (topicId) {
	var query = AV.Object.createWithoutData(className, topicId);
	query.set('deleted', true)
	return query.save()
};
