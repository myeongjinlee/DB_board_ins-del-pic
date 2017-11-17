var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*=============================================
  the global variable about 'Login module'
  using passport, session                     */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieSession = require('cookie-session');
var flash = require('connect-flash');
/*=============================================*/

var index = require('./routes/index');
var users = require('./routes/users');
var join = require('./routes/joinForm');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules'))); // 노드모듈 디렉토토리 추가

app.use('/', index);
app.use('/users', users);
app.use('/join', join);

/*==============================================
  regist the middleware called 'passport'
  about Login module.                          */

app.use(cookieSession({
  name: 'olens'         /* cookie name */,
  keys: ['test_olens']  /* secret key */,
  cookie: {             /* expiration time */
    maxAge: 1000 * 60 * 60 // 1 hour.
  }
})) // cookieSession은 request 객체를 통해 session을 다룰수 있게 설정해준다.
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
/*=============================================*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
