var express = require('express');
var router = express.Router();

/* MySQL Variable */
var mysql_dbc = require('./db/db_con')();
var connection = mysql_dbc.init();

/* 마이 페이지 */
router.get('/', function(req, res, next) {
  var user_info = req.session.passport.user;

  var first_query = 'select * from boards where ID = ? order by hit desc'; // 좋아요에 대한 쿼리문으로 변경하여야함!
  connection.query(first_query, user_info.user_id, function (err, first_results) {
    if(err) {
      console.error('query error : ' + err);
    } else {
      var second_query = 'select * from boards where ID = ? order by NO asc';
      connection.query(second_query, user_info.user_id, function (err, second_results) {
        if(err) {
          console.error('query error : ' + err);
        } else {
          res.render('mypage', {
            user : user_info,
            likedPosts : first_results,
            writtenPosts : second_results,
            categories : {}
          });
        }
      })
    }})
});

module.exports = router;
