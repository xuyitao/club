var AV 						= require('leanengine'),
		validator     = require('validator'),
		User					= require('../proxy/user');

exports.callback = function (req, res, next) {

	var profile = req.user;
	var email = profile.emails && profile.emails[0] && profile.emails[0].value;
	console.log('callback='+JSON.stringify(profile));
	User.getUsersByGitId(profile.id).then(function (user) {
		let username = email;
		let password = '123456';
		if(!user) {
			user = new AV.User();
			user.set('username', username);
			user.set('password', password);
		}
		user.set('githubUsername', profile.username);
		user.set('githubId', profile.id);
		user.set('githubAccessToken', profile.accessToken);
		user.set('avatar', profile._json.avatar_url);
		user.set('email', email);

		return user.save().then(function (user) {
			return AV.User.logIn(username, password)
		}).then(function (user) {
			res.saveCurrentUser(user);
			res.redirect('/github');
		});

	}).catch(function (err) {
		console.log(err);
		next(err);
	})
}

exports.githubMiddle = function (accessToken, refreshToken, profile, cb) {
	profile.accessToken = accessToken;
  cb(null, profile);
};
