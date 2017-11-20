var express = require('express');
var router = express.Router();

/* MySQL Variable */
var mysql_dbc = require('./db/db_con')();
var connection = mysql_dbc.init();

router.get('/',function(req,res,next){
   res.redirect('/mylist/1');
 });

/* 마이 페이지 */
router.get('/mylist/:page', function(req, res, next) {
  var user_info = req.session.passport.user;
  var likeTitle = [], likeImgs = [],likeContents= [];
  var writeTitle= [], writeImgs = [], writeContents= [];
  var page = req.params.page;
  var page_num = 4;
  var likeleng,writeleng;
  var first_query = 'select * from boards where NO in (select NO from is_like where ID= ?)';
  connection.query(first_query, user_info.user_id, function (err, first_results) {
    if(err) {
      console.error('query error : ' + err);
    } else {
      var second_query = 'select * from boards where ID = ? order by NO asc';
      connection.query(second_query, user_info.user_id, function (err, second_results) {
        if(err) {
          console.error('query error : ' + err);
        } else {
          repeatConsoleLog = function(i, callback) {
          setTimeout(function() {
            var url = first_results[i].URL;
              request(url, function(error, response, html)
              {
                var $ = cheerio.load(html);

                likeTitle[i] = $('meta[property="og:title"]').attr('content');
                likeContents[i] = $('meta[property="og:description"]').attr('content');
                likeImgs[i] = $('meta[property="og:image"]').attr('content');

                if(likeTitle[i]  == null) {likeTitle[i] = $('title').text();}
                if(likeTitle[i]  == null) {likeTitle[i] = $('h1').text();}
                if(likeTitle[i]  == null) {likeTitle[i] = $('h2').text();}
                if(likeContents[i] == null) {likeContents[i] = $('p').text().substr(0,100);}
                if(likeImgs[i] == null) {likeImgs[i] = $('img').attr('src');}
              });
            var url2 = second_results[i].URL;
              request(url2, function(error, response, html)
              {
                  var $ = cheerio.load(html);

                  writeTitle[i] = $('meta[property="og:title"]').attr('content');
                  writeContents[i] = $('meta[property="og:description"]').attr('content');
                  writeImgs[i] = $('meta[property="og:image"]').attr('content');

                  if(writeTitle[i]  == null) {writeTitle[i] = $('title').text();}
                  if(writeTitle[i]  == null) {writeTitle[i] = $('h1').text();}
                  if(writeTitle[i]  == null) {writeTitle[i] = $('h2').text();}
                  if(writeContents[i] == null) {writeContents[i] = $('p').text().substr(0,100);}
                  if(writeImgs[i] == null) {writeImgs[i] = $('img').attr('src');}
                });
              if (i >= (page*page_num)) {
                  callback();
                } else {
                  repeatConsoleLog(i+1, callback);
                }
              }, 500);
            }
              // 이제 함수를 실행한다.
              repeatConsoleLog((page*page_num)-page_num, function() {
                // 함수의 실행이 모두 끝난 뒤에 이곳에 있는 코드가 실행된다.
                console.log('done');
                res.render('index', { boards : result, user : user_info , page : page, leng : Object.keys(result).length-1,page_num : 4, pass : true , title : title , img : imgs , content : contents });
                res.render('mypage', {
                  user : user_info,
                  likedPosts : first_results,
                  writtenPosts : second_results,
                  categories : {}, /* should feel */
                  page : page,
                  page_num : 4,
                  pass : true,
                  likeTitle : likeTitle ,
                  likeImgs :likeImgs,
                  likeContents :likeContents,
                  writeTitle :writeTitle,
                  writeImgs :writeImgs,
                  writeContents :writeContents,
                  likeleng : Object.keys(first_results).length-1,
                  writeleng : Object.keys(second_results).length-1
                });
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
