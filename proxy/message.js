var AV = require('leanengine'),
	debug = require('debug');

var className = 'message';
var adClass = AV.Object.extend(className);

/***
var MessageSchema = new Schema({
  type: { type: String },
  master_id: { type: ObjectId},
  author_id: { type: ObjectId },
  topic_id: { type: ObjectId },
  reply_id: { type: ObjectId },
  has_read: { type: Boolean, default: false },
  create_at: { type: Date, default: Date.now }
});
***/

exports.saveMessage = function (type, master_id, author_id, topic_id, reply_id) {

	let item = new adClass();
	item.set('type', type)
	item.set('master_id', master_id)
	item.set('author_id', author_id)
	item.set('topic_id', topic_id)
	item.set('reply_id', reply_id)
	return item.save();

}
