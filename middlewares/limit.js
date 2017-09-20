var config = require('../config');
var cache  = require('../common/cache');
var comFunc  = require('../common/utils');
var moment = require('moment');



var SEPARATOR = '^_^@T_T';

var makePerDayLimiter = function (identityName, identityFn) {
  return function (name, limitCount) {
    /*
    options.showJson = true 表示调用来自API并返回结构化数据；否则表示调用来自前段并渲染错误页面
    */
    return function (req, res, next) {
      var identity = identityFn(req);
      var YYYYMMDD = moment().format('YYYYMMDD');
      var key      = YYYYMMDD + SEPARATOR + identityName + SEPARATOR + name + SEPARATOR + identity;

      cache.get(key).then(function (count) {
          count = count || 0;
          if (count < limitCount) {
            count += 1;
            if(count == 0) {
                cache.set(key, count, 60 * 60 * 24);
            } else {
                cache.set(key, count);
            }
            res.set('X-RateLimit-Limit', limitCount);
            res.set('X-RateLimit-Remaining', limitCount - count);
            next();
          } else {
            res.status(200).send(comFunc.respFail(new Error(`频率限制：当前操作每天可以进行${limitCount}次`), req));
          }
      }).catch(next)
    };
  };
};

exports.peruserperday = makePerDayLimiter('peruserperday', function (req) {
    console.log('make='+req.currentUser.get('username'));
    return req.currentUser.get('username')
});

exports.peripperday = makePerDayLimiter('peripperday', function (req) {
  var realIP = req.get('x-real-ip');
  if (!realIP) {
    throw new Error('should provice `x-real-ip` header')
  }
  return realIP;
});
