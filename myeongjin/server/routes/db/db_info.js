/*
  We use MySQL Server, so it's file set some properties
  about each server.
*/

module.exports = (function () {
  return {
    local : { // localhost
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'dlaudwls2!',
      database: 'olens'
    },
    real : { // real server
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    },
    dev : { // develope server
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    }
  }
})();
