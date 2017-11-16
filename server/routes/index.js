var express = require('express');
var router = express.Router();

/* MySQL Variable */
var mysql_dbc = require('./db/db_con')();
var connection = mysql_dbc.init();

/* GET home page. */
router.get('/', function(req, res, next) {
  //기본 쿼리 문 : 히트순으로 정렬
  var query = 'select * from boards order by hit desc';
  connection.query(query, function (err, result) {
    if(err) {
        console.error('query error : ' + err);
    } else {
      console.log(result);
      res.render('index', { title: 'Express', boards : result });
    }
  })
});

module.exports = router;
