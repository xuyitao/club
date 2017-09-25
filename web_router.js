var express = require('express'),
	router 	= express.Router(),
	sign 		= require('./controllers/sign'),
	topic 	= require('./controllers/topic'),
	reply 	= require('./controllers/reply'),
	message	= require('./controllers/message'),
	config 	= require('./config'),
	limit 	= require('./middlewares/limit'),
	auth 		= require('./middlewares/auth');



router.post('/signin', sign.login);  // 登录校验
router.post('/verify', sign.verify);  // 登录校验
router.post('/topic/create', auth.userRequired, limit.peruserperday('create_topic', config.create_post_per_day), topic.put);
router.post('/topic/getByPage', topic.getByPage);
router.post('/topic/getDetail', topic.getDetail);
router.get('/topic/getUnReplyTopic', topic.getUnReplyTopic);
router.post('/topic/delete', topic.delete);
router.post('/topic/collect', auth.userRequired, topic.collect);
router.post('/topic/decollect', auth.userRequired, topic.decollect);

router.post('/reply/create', auth.userRequired,limit.peruserperday('create_reply', config.create_reply_per_day), reply.create);

router.get('/message/unReadMsg', auth.userRequired, message.unReadMsg);


module.exports = router;
