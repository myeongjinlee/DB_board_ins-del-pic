var express = require('express');
var router = express.Router();

/* 마이 페이지 */
router.get('/', function(req, res, next) {
  res.send('account/');
});

/* 회원 가입 */
router.get('/create', function (req, res, next) {
  res.render('joinForm');
})

module.exports = router;
