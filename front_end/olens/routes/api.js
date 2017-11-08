var express = require('express');
var router = express.Router();
var mysql_dbc = require('./db_con')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

router.post('/login', function (req, res, next) {
  var
    user_id = req.body.username,
    password =   req.body.password;

  connection.query('select * from `USERS` where `ID` = ?', user_id, function (err, result) {
    if (err) {
      console.log('err :' + err);
    } else {
      if (result.length === 0) {
        res.json({success: false, msg: '해당 유저가 존재하지 않습니다.'})
      } else {
        if (!bcrypt.compareSync(password, result[0].Password)) {
          res.json({success: false, msg: '비밀번호가 일치하지 않습니다.'})
        } else {
          res.json({success: true})
        }
      }
    }
  });
});
module.exports = router;
