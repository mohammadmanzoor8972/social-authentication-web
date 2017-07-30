//Load respective modules
var APIKeys =require('../controllers/credential');
var passport = require('passport');
var util = require('util');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google').Strategy;

function passportController(obj){
	this.passportType = obj;
	this.init();
}

passportController.prototype.init = function(){
	this.facebookCredential = {
	    clientID: APIKeys.FACEBOOK.APP_ID,
	    clientSecret: APIKeys.FACEBOOK.FACEBOOK_APP_SECRET,
	    callbackURL: APIKeys.FACEBOOK.CALLBACK_URL
  	};
  	this.twitterCredential = {
	    clientID: APIKeys.FACEBOOK.APP_ID,
	    clientSecret: APIKeys.FACEBOOK.FACEBOOK_APP_SECRET,
	    callbackURL: APIKeys.FACEBOOK.CALLBACK_URL
  	};
  	this.googleCredential = {
	    clientID: APIKeys.FACEBOOK.APP_ID,
	    clientSecret: APIKeys.FACEBOOK.FACEBOOK_APP_SECRET,
	    callbackURL: APIKeys.FACEBOOK.CALLBACK_URL
  	};
  	this.serializeUser();
  	this.deserializeUser();
  	this.facebookInitiliaze();
  	this.twitterInitiliaze();
  	this.googleInitiliaze();
}

passportController.prototype.serializeUser = function(){
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});
}

passportController.prototype.deserializeUser = function(){
	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});
}

passportController.prototype.facebookInitiliaze = function(){
	var that = this;
	passport.use(new FacebookStrategy(that.facebookCredential,
		  function(accessToken, refreshToken, profile, done) {
		    process.nextTick(function () {
		      return done(null, profile);
		    });
		  }
	));
}

passportController.prototype.twitterInitiliaze = function(){
	var that = this;
	passport.use(new TwitterStrategy(that.twitterCredential,
      function(token, tokenSecret, profile, done) {
          return done(null, profile);
      }
    ));
}

passportController.prototype.googleInitiliaze = function(){
	var that = this;
	passport.use(new GoogleStrategy(that.googleCredential,
      function(identifier, profile, done) {
          return done(err, profile);
      }
    ));
}

passportController.prototype.FacebookAuthenticate = function(resp) {
	resp(passport.authenticate('facebook'));
}



module.exports({'passportController' : new passportController()})



