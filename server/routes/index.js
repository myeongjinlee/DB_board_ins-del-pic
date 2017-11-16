var express = require('express');
var router = express.Router();

/* MySQL Variable */
var mysql_dbc = require('./db/db_con')();
var connection = mysql_dbc.init();

/* Passport, Session Variable */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


/* If success login, then stored user information about session */
passport.serializeUser(function (user, done) {
  done(null, user)
});

/* 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴. */
passport.deserializeUser(function (user, done) {
  done(null, user);
});

/* 로그인 유저 판단 로직 */
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

/* 로그인 인증로직 */
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, username, password, done) {
  var query = 'select * from `users` where `ID` = ?';
  connection.query(query, username, function (err, result) {
    if (err) {
      console.log('err :' + err);
      return done(false, null);
    } else {
      if (result.length === 0) {
        console.log('해당 유저가 없습니다');
        return done(false, null);
      } else {
        if (password != result[0].Password) {
          console.log('패스워드가 일치하지 않습니다');
          return done(false, null);
        } else {
          console.log('로그인 성공');
          return done(null, {
            'user_id': result[0].ID,
            'nickname': result[0].Name
          });
        }
      }
    }
  })
}));

router.get('/', function(req, res, next) {
  //기본 쿼리 문 : 히트순으로 정렬
  var query = 'select * from boards order by hit desc';
  var user_info = req.session.passport.user;
  connection.query(query, function (err, result) {
    if(err) {
        console.error('query error : ' + err);
    } else {
      res.render('index', { boards : result, user : user_info });
    }
  })
});

/* 회원 가입 */
router.get('/createAccount', function (req, res, next) {
  res.render('createAccount');
})

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate(
  'local',
  {failureRedirect: '/login', failureFlash: true}) /*인증 실패시*/,
  function (req, res) { /*인증 성공시*/
    res.redirect('/');
  }
)

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
