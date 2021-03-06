var express = require('express');
var router = express.Router();

/* MySQL Variable */
var mysql_dbc = require('./db/db_con')();
var connection = mysql_dbc.init();

var request = require("request");
var cheerio = require("cheerio");

/* 회원 가입 */
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
      res.send('<script>alert("아이디가 존재합니다.");location.href="/";</script>');
    } else {
      res.send('<script>alert("회원가입이 완료되었습니다.");location.href="/";</script>');
    }
  });
});

/* 게시글 등록 */
router.post('/writePost', function (req, res, next) {
  request(req.body.URL, function (err, req_res, html) {
    if(err) throw err;

    var $ = cheerio.load(html);
    var title = $('meta[property="og:title"]').attr('content');
    var content = $('meta[property="og:description"]').attr('content');
    var image = $('meta[property="og:image"]').attr('content');
    if(title == null) {
      title = $('title').text();
    }
    if(title == null) {
      title = $('h1').text();
    }
    if(title == null) {
      title = $('h2').text();
    }
    if(content == null) {
      content = $('p').text().substr(0,100);
    }
    if(image == null) {
        image = $('img').attr('src');
    }

    /*이미지 없을시 대체 이미지, 마지막에 수업때 나눠준 서버 연결할때 구현!!!!!*/
    // var confirm_image = image;
    // confirm_image = confirm_image.split('/');
    // if(confirm_image[0].length == 0){
    //   image = 0;
    //   image = '/assets/images/9.jpg';
    // }

    var user_title;
    if(req.body.Title) {
      user_title = req.body.Title;
    } else {
      user_title = title;
    }

    var value = {
      ID            : req.session.passport.user.user_id,
      Title         : user_title,
      Content       : req.body.Content,
      URL           : req.body.URL,
      MetaTitle     : title,
      MetaContent   : content,
      MetaImage     : image
    }

    var HashTags = req.body.HashTags;
    HashTags = HashTags.split(' ').join(''); //공백제거
    HashTags = HashTags.split(',');

    var first_query = 'insert into BOARDS SET NO = NULL, Hit = 0, Create_date = now(), ?';
    connection.query(first_query, value, function (err, result) {
      if(err) {
        console.log('err :' + err);
        res.send('<script>alert("등록 중 에러가 발생하였습니다.");location.href="/account/writePost";</script>');
      } else {
        var NO = result.insertId;
        var second_query = 'insert into HASHTAGS(NO,HashTag) VALUES';
        for(var i=0; i<HashTags.length; i++) {
          second_query += '(' + NO + ',' + '"' + HashTags[i] + '"' + ')';
          if(i!=HashTags.length-1) second_query +=',';
        } second_query += ';';
        connection.query(second_query,function (err, result) {
          if(err) {
            console.log('err :' + err);
            res.send('<script>alert("등록 중 에러가 발생하였습니다.");location.href="/account/writePost";</script>');
          } else {
            console.log('게시글 등록이 완료되었습니다.');
            res.send('<script>alert("게시글 등록이 완료되었습니다.");location.href="/account/";</script>');
          }
        })
      }
    })
  })
})

/* 게시글 삭제, Ajax */
router.post('/deletePost', function (req, res, next) {
  var value = [req.body.user_id,req.body.board_no];
  var query = 'delete from boards where ID=? and NO=?';

  // NOTE: 쿼리 검증 필요! 비어있는 데 삭제할시 에러 등등..
  connection.query(query, value, function (err, result) {
    if(err) {
      console.log('err: ' + err);
      res.send({result:'failed'});
    } else {
      console.log('API delete post no.%s: success',req.body.board_no);
      res.send({result:'success'});
    }
  })
})
/* 게시글 수정, Ajax */
router.post('/updatePost', function (req, res, next) {
  var value = req.body.board_no;
  console.log(value);
  var query = 'select b.NO,Title,URL,Content,HashTags from boards b,concat_hashtags c where b.NO = c.NO and b.NO= ?';
  connection.query(query, value, function (err, result) {
    if(err) {
      console.log('err :' + err);
    } else {
      console.log(result[0]);
      res.json({result : result[0]});
    }
  });
});


router.post('/editPost', function (req, res, next) {
  var board_no = req.body.boardno;
  var value = [req.body.Title,req.body.URL,req.body.Content,req.body.boardno];
  var query = 'update boards set boards.Title=?,boards.URL=?,boards.Content=? where NO=?';
  connection.query(query, value, function (err, result) {
    if(err) {
      console.log('err :' + err);
      res.send('<script>alert("수정 중 에러가 발생하였습니다.");location.href="/account/";</script>');
    } else {
      var second_query = 'delete from hashtags where hashtags.NO = ?';
      connection.query(second_query,board_no,function (err, result) {
      if(err) {
          console.log('err :' + err);
          res.send('<script>alert("수정 중 에러가 발생하였습니다.");location.href="/account/";</script>');
      } else {
          var NO = req.body.boardno;
          var HashTags = req.body.HashTags;
          HashTags = HashTags.split(' ').join(''); //공백제거
          HashTags = HashTags.split(',');

          var third_query = 'insert into HASHTAGS(NO,HashTag) VALUES';
          for(var i=0; i<HashTags.length; i++) {
              third_query += '(' + NO + ',' + '"' + HashTags[i] + '"' + ')';
              if(i!=HashTags.length-1) third_query +=',';
          } third_query += ';';
          connection.query(third_query,function (err, result) {
          if(err) {
              console.log('err :' + err);
              res.send('<script>alert("수정 중 에러가 발생하였습니다.");location.href="/account/";</script>');
          } else {
              console.log('게시글 수정이 완료되었습니다.');
              res.send('<script>alert("게시글 수정이 완료되었습니다.");location.href="/account/";</script>');
          }
          })
        }
      })
    }
  });
});


/* Ajax : 좋아요 */
router.post('/like', function (req, res, next) {
  var state = req.body.state;
  var value = [req.body.user_id,req.body.board_no];

  var query;
  if(state=='do') { /* 좋아요 등록 */
    query = 'insert into is_like SET ID=?, NO=?, Like_date = now()';
  } else if(state=='undo'){ /* 좋아요 취소 */
    query = 'delete from is_like where ID=? ANd NO=?';
  } else {
    res.send({result:'failed'});
  }

  // NOTE: 쿼리 검증 필요! 비어있는 데 삭제할시 에러 등등..
  connection.query(query, value, function (err, result) {
    if(err) {
      console.log('err: ' + err);
      res.send({result:'failed'});
    } else {
      if(state=='do') console.log('API insertion like: success');
      else console.log('API deleteion like: success');
      res.send({result:'success'});
    }
  })
})

module.exports = router;
