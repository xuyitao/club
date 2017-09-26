var validator     = require('validator'),
		User					= require('../proxy/user');

exports.callback = function (req, res, next) {

	var profile = req.user;
	var email = profile.emails && profile.emails[0] && profile.emails[0].value;
	console.log('callback='+profile);
	User.getUsersByGitId(profile.id).then(function (user) {
		if(user) {
			user.set('githubUsername', profile.username);
			user.set('githubId', profile.id);
			user.set('githubAccessToken', profile.accessToken);
			user.set('avatar', profile._json.avatar_url);
			user.set('email', email || user.email);
			user.save();
			res.saveCurrentUser(user);
			res.redirect('/');
		} else {

		}
	}).catch(function (err) {
		next(err);
	})
}


exports.githubMiddle = function (accessToken, refreshToken, profile, cb) {
	console.log('githubMiddle='+githubMiddle);
  var email = profile.emails && profile.emails[0] && profile.emails[0].value;
  User.getUsersByGitId(profile.id).then(function (user) {
		user.set('githubUsername', profile.username);
		user.set('githubId', profile.id);
		user.set('githubAccessToken', profile.accessToken);
		user.set('avatar', profile._json.avatar_url);
		user.set('email', email || user.email);
		user.save();
		cb(null, user)
	}).catch(function (err) {
		cb(err)
	})
  done(null, profile);
};