var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var session = require('express-session');
var passport = require('passport');

//session 사용
router.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true
}));

router.use(passport.initialize()); //passport 시 필수 구문
router.use(passport.session());   //필 수 구 문. session을 이전에 세팅해놓고 추가


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title : 'Express' });
})

router.get('/joinForm', function (req, res, next) {
  res.render('joinForm', { title : 'Express' });
})

module.exports = router;
