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
			// let ignoretab = ['job', 'dev'];
			// query.notContainedIn('tab', ignoretab)
		} else if (tab == 'good'){
			query.equalTo('good', true)
		} else {
			query.equalTo('tab', tab)
		}
		query.count().then(function (count) {
			console.log('count='+count);
			resObj['count']=count;
			query.limit(size);
		    query.skip(size * page);
			query.include('author_id');
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
	return query.first()

}
