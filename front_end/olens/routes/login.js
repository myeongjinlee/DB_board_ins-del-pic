var express = require('express');
var router = express.Router();
var session = require('express-session');
var passport = require('passport')//passport-인증방법(ex, facebook, twitter etc..)
var LocalStrategy = require('passport-local').Strategy //로컬 방식의 passport이용
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit : 5,
  host : 'localhost',
  user : 'root',
  database : 'olens',
  password : 'dlaudwls2!'
});
var bcrypt = require('bcrypt');

//session 사용
router.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true
}));

//passport 시 필수 구문
router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, username, password, done) {
  connection.query('select * from `USERS` where `ID` = ?', username, function (err, result) {
    if (err) {
      console.log('err :' + err);
      return done(false, null);
    } else {
      if (result.length === 0) {
        console.log('해당 유저가 없습니다');
        return done(false, null);
      } else {
        if (!bcrypt.compareSync(password, result[0].Password)) {
          console.log('패스워드가 일치하지 않습니다');
          return done(false, null);
        } else {
          console.log('로그인 성공');
          return done(null, {
            user_id: result[0].ID
          });
        }
      }
    }
  })
}));


// 로그인에 성공할 시 serializeUser 메서드를 통해서 사용자 정보를 Session에 저장하게 됩니다
passport.serializeUser((user, done)=>{//passport.use에서 done으로 준 객체를 첫번쨰 인자로 받음
  done(null, user.username);//session에 현재 접근한 user의 authId를 등록
});

// 로그인에 성공하게 되면 Session정보를 저장을 완료했기에 이제 페이시 접근 시마다 사용자 정보를 갖게 Session에 갖게 됩니다.
// 인증이 완료되고 페이지 이동시 deserializeUser 메서드가 호출
passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
   done(null, user); // 여기의 user가 req.user가 됨
 });


router.post('/login', function (req, res, next) {
  var id = req.body.ID;
  var pw = req.body.Password;

  pool.getConnection(function(err,connection){
  connection.query('SELECT * FROM USERS WHERE ID = ?',id, function (err, result) {
    if (err){
      console.log('err :' + err);
    }
    else{
      if (result.length === 0){
        res.send('<script>alert("해당 유저가 존재하지 않습니다.");location.href="/login";</script>');
        res.json({success: false});
      }
      else{
        if (!bcrypt.compareSync(pw, result[0].Password)){
          res.send('<script>alert("비밀번호가 일치하지 않습니다.");location.href="/login";</script>');
          res.json({success: false})
        }
        else {
          res.json({success: true})
        }
      }
    }
    });
  });
});

module.exports = router;
