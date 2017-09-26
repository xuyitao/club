var AV 						= require('leanengine'),
		validator     = require('validator'),
		User					= require('../proxy/user');

exports.callback = function (req, res, next) {

	var profile = req.user;
	var email = profile.emails && profile.emails[0] && profile.emails[0].value;
	console.log('callback='+JSON.stringify(profile));
	User.getUsersByGitId(profile.id).then(function (user) {
		user.set('githubUsername', profile.username);
		user.set('githubId', profile.id);
		user.set('githubAccessToken', profile.accessToken);
		user.set('avatar', profile._json.avatar_url);
		user.set('email', email || user.email);
		user.save();
		return AV.User.signUpOrlogInWithAuthData({
			uid:          profile.id,
    	access_token: profile.accessToken
		},'github');
	}).then(function (user) {
		res.saveCurrentUser(user);
		res.redirect('/');
	}).catch(function (err) {
		next(err);
	})
}

exports.githubMiddle = function (accessToken, refreshToken, profile, cb) {
	profile.accessToken = accessToken;
  cb(null, profile);
};
