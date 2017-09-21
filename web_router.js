var express = require('express'),
	router = express.Router(),
	sign = require('./controllers/sign'),
	topic = require('./controllers/topic'),
	reply = require('./controllers/reply'),
	config = require('./config'),
	limit = require('./middlewares/limit'),
	auth = require('./middlewares/auth');



router.post('/signin', sign.login);  // 登录校验
router.post('/verify', sign.verify);  // 登录校验
router.post('/topic/create', auth.userRequired, limit.peruserperday('create_topic', config.create_post_per_day), topic.put);
router.post('/topic/getByPage', topic.getByPage);
router.post('/topic/getDetail', topic.getDetail);

router.post('/reply/create', auth.userRequired,limit.peruserperday('create_reply', config.create_reply_per_day), reply.create);

module.exports = router;
