var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
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
})

router.get('/joinForm', function (req, res, next) {
  res.render('joinForm', { title : 'Express' });
})

module.exports = router;
