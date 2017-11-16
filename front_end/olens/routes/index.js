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
// 
// //session 사용
// router.use(session({
//  secret: '@#@$MYSIGN#@$#$',
//  resave: false,
//  saveUninitialized: true,
//  store: new MySQLStore({
//    host : 'localhost',
//    user : 'root',
//    database : 'olens',
//    password : '1234'
//  })
// }));
//
// var pool = mysql.createPool({
//   connectionLimit : 5,
//   host : 'localhost',
//   user : 'root',
//   database : 'olens',
//   password : '1234'
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title : 'Express' });
});

router.post('/login', function (req, res, next) {
  var id = req.body.userid;
  var pw = req.body.password;

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
          res.send('<script>alert("로그인 되었습니다.");location.href="/";</script>');
          //res.redirect('/');
          //res.json({success: true})
        }
      }
    });
  });
});

router.get('/joinForm', function (req, res, next) {
  res.render('joinForm', { title : 'Express' });
})

module.exports = router;
