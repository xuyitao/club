var Message     = require('./message'),
    _           = require('underscore')
    User        = require('../proxy/user');

/**
 * 从文本中提取出@username 标记的用户名数组
 * @param {String} text 文本内容
 * @return {Array} 用户名数组
 */
var fetchUsers = exports.fetchUsers= function (text) {
  if (!text) {
    return [];
  }

  var ignoreRegexs = [
    /```.+?```/g, // 去除单行的 ```
    /^```[\s\S]+?^```/gm, // ``` 里面的是 pre 标签内容
    /`[\s\S]+?`/g, // 同一行中，`some code` 中内容也不该被解析
    /^    .*/gm, // 4个空格也是 pre 标签，在这里 . 不会匹配换行
    /\b\S*?@[^\s]*?\..+?\b/g, // somebody@gmail.com 会被去除
    /\[@.+?\]\(\/.+?\)/g, // 已经被 link 的 username
  ];

  ignoreRegexs.forEach(function (ignore_regex) {
    text = text.replace(ignore_regex, '');
  });

  var results = text.match(/@[a-z0-9\-_]+\b/igm);
  var names = [];
  if (results) {
    for (var i = 0, l = results.length; i < l; i++) {
      var s = results[i];
      //remove leading char @
      s = s.slice(1);
      names.push(s);
    }
  }
  names = _.uniq(names);
  return names;
};

/**
 * 根据文本内容中读取用户，并发送消息给提到的用户
 * Callback:
 * - err, 数据库异常
 * @param {String} text 文本内容
 * @param {String} topicId 主题ID
 * @param {String} authorId 作者ID
 * @param {String} reply_id 回复ID
 * @param {Function} callback 回调函数
 */
 exports.sendMessageToMentionUsers = function (text, topicId, authorId, reply_id) {

    return User.getUsersByNames(fetchUsers(text)).then(function (users) {
   		if(users.length == 0) {
			return true;
		} else {
			users = users.filter(function (user) {
			  	return !user.getObjectId().equals(authorId);
			});
			return Message.sendAtMessage(user._id, authorId, topicId, reply_id);
		}
    })
 };

 /**
  * 根据文本内容，替换为数据库中的数据
  * Callback:
  * - err, 数据库异常
  * - text, 替换后的文本内容
  * @param {String} text 文本内容
  * @param {Function} callback 回调函数
  */
 exports.linkUsers = function (text, callback) {
   var users = fetchUsers(text);
   for (var i = 0, l = users.length; i < l; i++) {
     var name = users[i];
     text = text.replace(new RegExp('@' + name + '\\b(?!\\])', 'g'), '[@' + name + '](/user/' + name + ')');
   }
   if (!callback) {
     return text;
   }
   return callback(null, text);
 };
