var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , FacebookStrategy = require('passport-facebook').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , GoogleStrategy = require('passport-google').Strategy
  , logger = require('morgan')
  , session = require('express-session')
  , bodyParser = require("body-parser")
  , cookieParser = require("cookie-parser")
  , path = require("path")
  , methodOverride = require('method-override');

var routerAPIs = require('./routes/api');

var FACEBOOK_APP_ID = "843750715696389"
var FACEBOOK_APP_SECRET = "de09ba4f370b17c7f7c822db9b4e2b10";
var TWITTER_CONSUMER_KEY = "k4LKlkJL7AX4fz72hGkTPjpvl";
var TWITTER_CONSUMER_SECRET = "1O01sweQ146LoPFxrZkxxuiSMpfPPFdZDM7lkMuntEW7maQEGr";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

  passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:3000/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, done) {
          
          //res.end(profile);
          return done(null, profile);
        /*User.findOrCreate(..., function(err, user) {
          if (err) { return done(err); }
          done(null, user);
        });*/
      }
    ));

    passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/login'
      },
      function(identifier, profile, done) {
          //res.end(profile);
          return done(err, profile);
//        User.findOrCreate({ openId: identifier }, function(err, user) {
//          done(err, user);
//        });
      }
    ));


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(methodOverride());
//app.use(bodyParser.json());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function(req, res){
    res.render('index', { user: req.user });
});

app.get('/login', function(req, res){
    res.render('outh', { user: req.user });
});

//Web APIs for Cloudinery, Facebook, Twitter, Google
app.post('/api/uploadImage/', routerAPIs.uploadImage);
app.get('/api/listAllUploadedImages/', routerAPIs.listAllUploadedImages);

/*Facebook API*/

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/login');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


/*Twitter APIs*/

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/login',
                                     failureRedirect: '/login' }));

app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/google/return', 
  passport.authenticate('google', { successRedirect: '/login',
                                    failureRedirect: '/login' }));


app.set('port', 3000);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});