var express = require('express');
var router = express.Router();
var session = require('express-session');
var passport = require('passport');
var mysql = require('mysql');
var cheerio = require('cheerio');
var request = require('request');

var pool = mysql.createPool({
  connectionLimit : 5,
  host : 'localhost',
  user : 'root',
  database : 'olens',
  password : 'dlaudwls2!'
});

//session 사용
router.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true
}));

router.use(passport.initialize()); //passport 시 필수 구문
router.use(passport.session());   //필 수 구 문. session을 이전에 세팅해놓고 추가
var title = new Array();

/* GET home page. */
router.get('/', function(req, res, next) {
  pool.getConnection(function(err,connection){
    var boardlist = "SELECT ID,Content,URL,Hit,date_format(create_date,'%Y-%m-%d %H:%i:%s')create_date FROM boards order by Hit DESC";
    connection.query(boardlist,function(err,rows){
      if(err) {
        console.log("err : " + err);
      }else {
        for(var i=0;i<rows.length;i++){
          var url = rows[i].URL;
          request(url, function(error, response, html){
              if (error) {throw error};
              var $ = cheerio.load(html);
              $('h2').each(function(){
                if($(this).text().length != 0 )
                title[i]=$(this).text();
                //console.log(title[i]);
              });
            });
          }
          console.log(title);
          res.render('index', {rows,title});
          connection.release();
        }
    });
  });
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
