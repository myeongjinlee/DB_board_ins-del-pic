var express = require('express');
var router = express.Router();

/* 마이 페이지 */
router.get('/', function(req, res, next) {
  var user_info = req.session.passport.user;
  res.render('mypage', { user : user_info });
});

module.exports = router;
