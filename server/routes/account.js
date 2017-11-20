var express = require('express');
var router = express.Router();

/* MySQL Variable */
var mysql_dbc = require('./db/db_con')();
var connection = mysql_dbc.init();

/* 마이 페이지 */
router.get('/', function(req, res, next) {
  if(req.session.passport===undefined || req.session.passport.user===undefined) {
    res.send('<script>alert("로그인이 필요합니다.");location.href="/login";</script>');
  }

  var user_info = req.session.passport.user;
  var first_query =
  'select boards.NO as NO, Hit, Create_date, ID, Title, \
  Content, URL, MetaTitle, MetaContent, MetaImage, HashTags, Likes \
  from (boards left join concat_hashtags on boards.NO=concat_hashtags.NO) \
  left join total_likes on boards.NO = total_likes.NO \
  where boards.NO in ( select NO from is_like where ID=? ) \
  order by boards.NO asc, hit desc';
  /* total_likes view is...
    create view total_likes as
    select boards.NO, count(*) as Likes
    from boards, is_like
    where boards.NO = is_like.NO
    group by boards.NO;

    concat_hashtags view is...
    create view concat_hashtags as
    select NO, group_concat(hashtag separator ',')) as HashTags
    from hashtags group by hashtags.NO;
  */
  connection.query(first_query, user_info.user_id, function (err, first_results) {
    if(err) {
      console.error('query error : ' + err);
    } else {
      var second_query =
      'select boards.NO as NO, Hit, Create_date, boards.ID as ID, Title, \
      Content, URL, MetaTitle, MetaContent, MetaImage, HashTags, Likes, is_like.ID as WhoLike \
      from (boards left join concat_hashtags on boards.NO=concat_hashtags.NO) \
      left join total_likes on boards.NO = total_likes.NO \
      left join is_like on boards.NO = is_like.NO and is_like.ID = ? \
      where boards.ID = ? \
      order by boards.NO asc, hit desc';

      connection.query(
        second_query,
        [user_info.user_id, user_info.user_id],
        function (err, second_results) {
          if(err) {
            console.error('query error : ' + err);
          } else {
            res.render('mypage', {
              user : user_info,
              likedPosts : first_results,
              writtenPosts : second_results,
              categories : {} /* should feel */
            });
          }
        }
      )
    }
  })
});

/* 게시글 등록 */
router.get('/writePost', function (req, res, next) {
  var user_info = req.session.passport.user;
  res.render('writePost', { user : user_info });
});

module.exports = router;
