
var Config    = require('../config')

exports.adminRequired = function (req, res, next) {
  if (!req.session.user) {
    return res.render('notify/notify', { error: '你还没有登录。' });
  }

  if (!req.session.user.is_admin) {
    return res.render('notify/notify', { error: '需要管理员权限。' });
  }

  next();
};

/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
  if (!req.currentUser) {
    return res.status(401).send('需要登陆');
  }
  next();
};



exports.github = function (req, res, next) {
  if (Config.GITHUB_OAUTH.clientID === '490d02d2f03f9cc522cf') {
    return res.send('call the admin to set github oauth.');
  }
  next();
};
