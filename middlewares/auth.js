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
    return res.status(403).send('forbidden!');
  }
  next();
};
