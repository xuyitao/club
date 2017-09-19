var message = require('../proxy/message')




exports.sendReplyMessage = function (master_id, author_id, topic_id, reply_id) {
	return message.sendMessage('reply', master_id, author_id, topic_id, reply_id)
};


exports.sendAtMessage = function (master_id, author_id, topic_id, reply_id, callback) {
  return message.sendMessage('at', master_id, author_id, topic_id, reply_id)
};
