var express = require('express');
var router = express.Router();

//creawling
var cheerio = require('cheerio');
var request = require('request');

/* MySQL Variable */
var mysql_dbc = require('./db/db_con')();
var connection = mysql_dbc.init();

router.post('/islike', function(req, res, next) {
  var value = {
    ID     : req.session.passport.user.user_id,
    NO     : req.body.button
  };
  console.log(req.session.passport);

  var query = 'insert into `is_like` SET ?, Like_date = now()';
  connection.query(query, value, function (err, result) {
    if(err) {
      console.log('err :' + err);
      res.send('<script>alert("로그인 해주세요.");location.href="/login";</script>');
    } else {
      res.send('<script>alert("좋아요ㅎㅎ");location.href="/";</script>');
    }
  });
});

router.post('/createAccount', function(req, res, next) {
  var value = {
    ID            : req.body.id,
    Password      : req.body.password,
    Name          : req.body.name,
  };

  var query = 'insert into `USERS` SET ?, Regist_date = now()';
  connection.query(query, value, function (err, result) {
    if(err) {
      console.log('err :' + err);
      res.send('<script>alert("아이디가 존재합니다.");location.href="/createAccount";</script>');
    } else {
      res.send('<script>alert("회원가입이 완료되었습니다.");location.href="/";</script>');
    }
  });
});

router.post('/writePost', function (req, res, next) {
  var value = {
    ID            : req.session.passport.user.user_id,
    Title         : req.body.Title,
    Content       : req.body.Content,
    URL           : req.body.URL
  };


  var query = 'insert into BOARDS SET NO = NULL, ?, Hit = 0, Create_date = now()';
  connection.query(query, value, function (err, result) {
    if(err) {
      console.log('err :' + err);
      res.send('<script>alert("등록 중 에러가 발생하였습니다.");location.href="/account/writePost";</script>');
    } else {
      console.log('게시글 등록이 완료되었습니다.');
      res.send('<script>alert("게시글 등록이 완료되었습니다.");location.href="/account/";</script>');
    }
  })
})

module.exports = router;
