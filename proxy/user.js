var AV = require('leanengine'),
	debug = require('debug')('proxy:user');

var className = '_User';
var adClass = AV.Object.extend(className);



/**
 * 根据用户名列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByNames = function (names) {
	debug(`getUsersByNames names=${names.length}`)
	return new AV.Promise(function(resolve,reject) {
		if (names.length === 0) {
	      return resolve([]);
	    }
		let topic = new AV.Query(className);
		let regExp = new RegExp(names.join('|'), 'ig');
		topic.matches('username', regExp)
		topic.find().then(function (itemq) {
			resolve(itemq)
		}).catch(reject);
	});
};


/**
 * 根据用户名列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByGitId = function (githubId) {
	debug(`getUsersByGitId githubId=${githubId}`)
	let userQuery = new AV.Query(className);
	userQuery.equalTo('githubId', githubId);
	return userQuery.first();
};
