var express = require('express');
var router = express.Router();

/* MySQL Variable */
var mysql_dbc = require('./db/db_con')();
var connection = mysql_dbc.init();

router.post('/createAccount', function(req, res, next) {
  var user = {
    ID            : req.body.id,
    Password      : req.body.password,
    Name          : req.body.name,
  };

  var query = 'insert into `USERS` SET ?, Regist_date = now()';
  connection.query(query, user, function (err, result) {
    if(err) {
      console.log('err :' + err);
      res.send('<script>alert("아이디가 존재합니다.");location.href="/createAccount";</script>');
    } else {
      res.send('<script>alert("회원가입이 완료되었습니다.");location.href="/";</script>');
    }
  });
});

module.exports = router;
