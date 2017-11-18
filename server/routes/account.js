var express = require('express');
var router = express.Router();

/* MySQL Variable */
var mysql_dbc = require('./db/db_con')();
var connection = mysql_dbc.init();

/* 마이 페이지 */
router.get('/', function(req, res, next) {
  var user_info = req.session.passport.user;

  var first_query = 'select * from boards left join hashtags on boards.NO=hashtags.NO where boards.NO \
                    in (select NO from is_like where ID=?)';
  connection.query(first_query, user_info.user_id, function (err, first_results) {
    if(err) {
      console.error('query error : ' + err);
    } else {
      var second_query = 'select * from boards left join hashtags on boards.NO=hashtags.NO where ID = ?';
      connection.query(second_query, user_info.user_id, function (err, second_results) {
        if(err) {
          console.error('query error : ' + err);
        } else {
          console.log(second_results);
          res.render('mypage', {
            user : user_info,
            likedPosts : first_results,
            writtenPosts : second_results,
            categories : {} /* should feel */
          });
        }
      })
    }
  })
});

/* 게시글 등록 */
router.get('/writePost', function (req, res, next) {
  var user_info = req.session.passport.user;
  res.render('writePost', { user : user_info });
});

module.exports = router;
