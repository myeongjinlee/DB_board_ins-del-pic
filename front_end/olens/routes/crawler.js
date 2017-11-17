var cheerio = require('cheerio');
var request = require('request');

var url = 'http://blog.saltfactory.net';
request(url, function(error, response, html){
    if (error) {throw error};
    var $ = cheerio.load(html);
    $('h2,h3').each(function(){
        console.log($(this).text());
    })
});
