var express = require('express');
var router = express.Router();
var mysql_dbc = require('./db_con')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

var bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title : 'Express' });
})

router.get('/joinForm', function (req, res, next) {
  res.render('joinForm', { title : 'Express' });
})

module.exports = router;
