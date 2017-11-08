$('#frm_login').validate({
  onkeyup: false,
  submitHandler: function () {
    return true;
  },
  rules: {
    username: {
      required: true,
      minlength: 3
    },
    password: {
      required: true,
      minlength: 3,
      remote: {
        url: '/api/login',
        type: 'post',
        data: {
          username: function () {
            return $('#username').val();
          }
        },
        dataFilter: function (data) {
          var data = JSON.parse(data);
          if (data.success) {
            return true
          } else {
            return "\"" + data.msg + "\"";
          }
        }
      }
    }
  }
});
