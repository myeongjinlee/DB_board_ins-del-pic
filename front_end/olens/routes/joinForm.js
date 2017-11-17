var express = require('express');
var session = require('express-session');//세션 사용을 위한 모듈
var bodyParser = require('body-parser');//POST 방식 전송을 위해서 필요함
var router = express();
var MySQLStore = require('express-mysql-session')(session);//session mysql 스토어를 위해 사용
var bkfd2Password = require("pbkdf2-password");//pbkdf2-password 모듈 사용
var hasher = bkfd2Password();
var passport = require('passport');//passport 모듈 사용
var LocalStrategy = require('passport-local').Strategy;//passport 모듈 사용
var mysql = require('mysql');//MYSQL 사용하기위해 씀
/*
router.get('/complete', (req, res, next)=>{
  res.render('registercomplete.ejs');
});
*/
router.use(bodyParser.urlencoded({extended: false}));//미들웨어 등록부분

//resave 세션아이디를 접속할때마다 발급하지 않는다
router.use(session({
  secret: '12312dajfj23rj2po4$#%@#',
  resave: false,
  saveUninitialized: true,
  store:new MySQLStore({
      host: 'localhost',
      user: 'root',
      password: 'dlaudwls2!',
      database: 'olens'
    })
}));

var conn = mysql.createConnection({
host : 'localhost',
user : 'root',
password : '1234',
database : 'olens',
});

conn.connect();//database 접속 완료
router.use(passport.initialize());//passport 초기화
router.use(passport.session());//passport 인증 작업시 필요 이것은 세션을 사용하기 위한 윗 router.use(session)뒤에 써야한다

var users = [{
  Id:'leemj4050',
  Name:'이명진',
  password:'bXHtzdi7m+jclUksPwZQZSuknrreGuq9am4=',
},];

//회원 가입 처리
router.post('/', function(req, res){
hasher({Password:req.body.password}, function(err, pass, salt, hash){
  var user = {
      Id:req.body.id,
      //Password:hash,//hash로 대체함
      Password:req.body.password,
      Name:req.body.name,
      //Regist_date: now();
    };
    var sql = 'INSERT INTO `USERS` SET ? ,Regist_date = now()';
    conn.query(sql, user, function(err, results){
    if(err){
      console.log(err);
      res.send('<script>alert("아이디가 존재합니다.");location.href="/joinForm";</script>');
    }else{
      res.send('<script>alert("회원가입이 완료되었습니다.");location.href="/";</script>');
      //res.redirect('/joincomplete');
    }});/*
    users.push(user);//입력한 값을 users배열 맨뒤에 추가함
    req.login(user, function(err){//회원가입이 되고 바로 동시에 로그인 하기 위함
      req.session.id = req.body.id;
      req.session.save(function(){
        res.redirect('/');
      });
    });*/
  });
});

/*
router.post('/joinForm',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/joinForm',
    failureFlash: false })
);

//done(null, user)가 호출되면 이게 호출됨 여기의 user는 아래 콜백의 user임
passport.serializeUser(function(user, done) {
  console.log('serializeUser1234', user.Id);
  done(null, user.Id);//고유의 id값을 넘겨줘야함 유저를 찾는데 사용함 이 데이터는 세션에 저장됨
});

//serializeUser실행 후 다음 유저는 deserializeUser메소드로 옴
passport.deserializeUser(function(id, done) {
  console.log('deserializeUser1', id);
  /*for(var i=0; i < users.length; i++){
      var user = users[i];//??
      if(user.Id === id){//facebook 때문에 이부분이 수정된
        done(null, user);//여기가 끝나면 req.user에 user객체가 저장된다.
      }}
// done('There is no user');
      done(null, user);
  });

//미들웨어부분
passport.use(new LocalStrategy(
  function(id, password, done){//여기서 실제 사용자가 맞는지 인증하는 부분을 수행
    var uid = id;//POST방식으로 보낸 값을 가져옴
    var pwd = password;
    console.log(uid);console.log(pwd);
    for(var i=0; i < users.length; i++){//계정이 실제로 존재하는지 확인하는 루프
        var user = users[i];
        if(uid === user.ID){
          return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){//salt는 이미 저장된 salt값을 넘겨줌
            if(hash === user.password){//저장된 해쉬값과 만든 해쉬값이 같으면 인증 성공
              console.log('localstrategy1234');
              done(null, user);//로그인 성공을 의미 serializeUser 호출 윗 파라미터의 done이 아니다
            }else{
              done(null, false);//로그인 실패를 의미 message항목은 failureFlash가 true일때만 씀
            }
          });
        }
      }//for문종료

      done(null, false);
    }));

*/
module.exports = router;
