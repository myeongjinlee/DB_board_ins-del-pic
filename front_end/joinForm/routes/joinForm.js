var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('joinForm',{ title: '회원 가입' });
});

router.post('/',function(req,res,next){
	console.log(req.body);
	res.json(req.body);
});

module.exports = router;
