/*
  It's javascript file connects MySQL Server
  using properties module (it is setted 'db_info.js')
*/

var mysql = require('mysql');
var config = require('./db_info').local; // choose local properties.

/*
  this module returns two literals about
  init : it actually connects MySQL Server.
  test_open : we can test whether it connects mysql server using this.
*/
module.exports = function () {
  return {
    init: function () {
      return mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database
      })
    },

    test_open: function (con) {
      con.connect(function (err) {
        if(err) {
          console.error('mysql connection error : ' + err);
        } else {
          console.info('mysql is connected successfully.');
        }
      })
    }
  }
}
