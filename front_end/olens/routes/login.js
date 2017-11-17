var express = require('express');
var router = express.Router();
var session = require('express-session');
var passport = require('passport')//passport-인증방법(ex, facebook, twitter etc..)
var LocalStrategy = require('passport-local').Strategy //로컬 방식의 passport이용
var mysql = require('mysql');
var bkfd2Password = require('pbkdf2-password')//비밀번호 암호화 npm
var hasher = bkfd2Password();
var bodyParser = require('body-parser');
var MySQLStore = require('express-mysql-session')(session);

var pool = mysql.createPool({
  connectionLimit : 5,
  host : 'localhost',
  user : 'root',
  database : 'olens',
  password : 'dlaudwls2!'
});

router.use(passport.initialize()); //passport 시 필수 구문
router.use(passport.session());   //필 수 구 문. session을 이전에 세팅해놓고 추가
router.use(bodyParser.urlencoded({extended: false}));//미들웨어 등록부분

//session 사용
router.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true,
 store: new MySQLStore({
   host : 'localhost',
   user : 'root',
   database : 'olens',
   password : 'dlaudwls2!'
 })
}));
/*
router.post('/', function(req, res){
  var user = {//현재 유저는 한개만 있음
    Username:'1234',
    uname: '이명진',
    password:'1234'
  };
  var uid = req.body.Username;//POST방식으로 보낸 값을 가져옴
  var pwd = req.body.password;

  if(uid === user.Username && pwd === user.password){//아이디와 패스워드 둘다 같으면
    res.redirect('/'); //로그인된 메인으로 바꿔야지
////////////////////////////////////////////////////
  }else{//비밀번호가 틀리면
    res.send('who are you?<a href="/login">login</a>');
  }
});
*/
//local 전략이 실행되면 function(username, password, done) 콜백이 실행됨
/*
router.post('/',passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false }
)
);
*/
router.post('/',passport.authenticate('local'),function (req, res) {
  var id = req.body.Username;
  var pw = req.body.password;
  console.log('처리부분');
  console.log(id);
  pool.getConnection(function(err,connection){
    connection.query('SELECT * FROM `USERS` WHERE `ID` = ?',id, function (err, result) {
      console.log(result);
      if (result.length === 0){
          console.log('로그인실패');
        res.send('<script>alert("해당 유저가 존재하지 않습니다.");location.href="/login";</script>');
        //res.json({success: false});
      }
      else{
        if (pw != result[0].Password){
          console.log('로그인비번땡');
          res.send('<script>alert("비밀번호가 일치하지 않습니다.");location.href="/login";</script>');
          //res.json({success: false})
        }
        else {
          console.log('로그인성공');
          //res.send('<script>alert("로그인 되었습니다.");location.href="/";</script>');
          res.render('index.ejs', {user : req.body.Username});
          //res.json({success: true})
        }
      }
    });
  });
});

//passport 시 필수 구문
router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'password',
  passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, Username, password, done) {
  console.log('passport!!!!!!!!');
  pool.query('select * from `USERS` where `ID` = ?', Username, function (err, result) {
    if (err) {
      console.log('err :' + err);
      return done(null,false);
    } else {
      if (result.length === 0) {
        console.log('passport해당 유저가 없습니다');
        return done(null,false);
      } else {
        if (password != result[0].Password) {
          console.log('passport패스워드가 일치하지 않습니다');
          return done(null,false);
        } else {
          console.log('passport로그인 성공');
          return done(null, {
            Username: result[0].ID, message: '로그인 성공'
          });
        }
      }
    }
  })
}));

//done(null, user)가 호출되면 이게 호출됨 여기의 user는 아래 콜백의 user임
// 로그인에 성공할 시 serializeUser 메서드를 통해서 사용자 정보를 Session에 저장하게 됩니다
passport.serializeUser(function(user, done) {//passport.use에서 done으로 준 객체를 첫번쨰 인자로 받음
  console.log('serializeUser', user);
  console.log(user.Username);
  done(null, user.Username);//고유의 id값을 넘겨줘야함 유저를 찾는데 사용함 이 데이터는 세션에 저장됨
});

// 로그인에 성공하게 되면 Session정보를 저장을 완료했기에 이제 페이시 접근 시마다 사용자 정보를 갖게 Session에 갖게 됩니다.
// 인증이 완료되고 페이지 이동시 deserializeUser 메서드가 호출
passport.deserializeUser(function(id, done) {
  console.log('deserializeUser1', id);
//  for(var i=0; i < users.length; i++){
//    var user = users[i];
//    if(user.authId === id){//facebook 때문에 이부분이 수정된
//        done(null, user);//여기가 끝나면 req.user에 user객체가 저장된다.
//      }
    //}
    done(null, id);
});

module.exports = router;
