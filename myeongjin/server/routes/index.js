var express = require('express');
var router = express.Router();

/* MySQL Variable */
var mysql_dbc = require('./db/db_con')();
var connection = mysql_dbc.init();

//crawling
var cheerio = require('cheerio');
var request = require('request');

/* Passport, Session Variable */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* If success login, then stored user information about session */
passport.serializeUser(function (user, done) {
  done(null, user)
});

/* 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴. */
passport.deserializeUser(function (user, done) {
  done(null, user);
});

/* 로그인 유저 판단 로직 */
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

/* 로그인 인증로직 */
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, username, password, done) {
  var query = 'select * from `users` where `ID` = ?';
  connection.query(query, username, function (err, result) {
    if (err) {
      console.log('err :' + err);
      return done(false, null);
    } else {
      if (result.length === 0) {
        console.log('해당 유저가 없습니다');
        return done(false, null);
      } else {
        if (password != result[0].Password) {
          console.log('패스워드가 일치하지 않습니다');
          return done(false, null);
        } else {
          console.log('로그인 성공');
          return done(null, {
            'user_id': result[0].ID,
            'nickname': result[0].Name
          });
        }
      }
    }
  })
}));
router.get('/',function(req,res,next){
   res.redirect('/list/1');
 });

router.get('/list/:page', function(req, res, next) {
//  console.log(req);
  var user_info = req.session.passport===undefined ?
    0 : req.session.passport.user;
  var page = req.params.page;
  var page_num = 4;
  var leng,j=0;
  var title = [];var imgs = [];var temp = [];
  // //조회수, 좋아요 수 출력
  // var query =
  // connection.query(query, function (err, result) {
  //   //console.log(result);
  //   if(err) {
  //       console.error('query error : ' + err);
  //   } else {
  //
  //   }
  // });
  //기본 쿼리 문 : 히트순으로 정렬
  var query = 'select * from boards order by hit desc';
  connection.query(query, function (err, result) {
    //console.log(result);
    if(err) {
        console.error('query error : ' + err);
    } else {
      // 먼저 함수를 정의한다.
      repeatConsoleLog = function(i, callback) {
            setTimeout(function() {
              var url = result[i].URL;
                request(url, function(error, response, html)
                {
                  var $ = cheerio.load(html);
                  $('title').each(function(){
                      if($(this).text().length != 0 )
                        title[i]=$(this).text();
                  });
                  $("img").each(function(item,index,array){
                      if($(this).attr("src").length!=0 && $(this).attr("src").split('http://').length>1){
                             imgs[j++] = $(this).attr("src");
                      }
                      temp[i] = imgs[0];
                      j=0;
                  });
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
              console.log(temp);
              res.render('index', { boards : result, user : user_info , page : page, leng : Object.keys(result).length-1,page_num : 4, pass : true , title : title , img : temp });
      });
    }
  });
});

/* 회원 가입 */
router.get('/createAccount', function (req, res, next) {
  res.render('createAccount');
})

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate(
  'local',
  {failureRedirect: '/login', failureFlash: true}) /*인증 실패시*/,
  function (req, res) { /*인증 성공시*/
    res.redirect('/');
  }
)

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
