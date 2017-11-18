var cheerio = require('cheerio');
var request = require('request');

var url = 'http://blog.saltfactory.net';
request(url, function(error, response, html){
    if (error) {throw error};
    var $ = cheerio.load(html);
    for(i=0;i<rows.length;i++){
      var url = rows[i].URL;
      request(url, function(error, response, html){
          if (error) {throw error};
          var $ = cheerio.load(html);
          $('h2').each(function(){
            if($(this).text().length != 0 )
            title[i]=$(this).text();
            console.log(title[i]);
          });
        });
      }
});
