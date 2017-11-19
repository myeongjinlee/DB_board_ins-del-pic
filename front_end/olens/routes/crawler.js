var cheerio = require('cheerio');
var request = require('request');

var url = 'http://beomy.tistory.com/10';

request(url, function(error, response, html){
    if (error) {throw error};
    var $ = cheerio.load(html);
    var imgs = [];
    var i=0;
    $("img").each(function(item,index,array){

            if($(this).attr("src").length!=0 && $(this).attr("src").split('http://').length>1)
               imgs[i++] = $(this).attr("src");

    });
      console.log(imgs[0]);
    });


    ///////////////////////////////////////////////////////////////////////////////////////////////////



// request(url, function(error, response, html){
//     if (error) {throw error};
//     var $ = cheerio.load(html);
//     $('img').each(function(){
//         if($(this).text().length != 0 )
//               title=$(this).text();
//       console.log(title);
//     });
// });

// if($(this).attr("src").split('.jpg').length>1 && $(this).attr("src").split('http://').length>1)
//                                               imgs.push($(this).attr("src"));
// request(url, function(error, response, html){
//     if (error) {throw error};
//     var $ = cheerio.load(html);
//     $('title').each(function(){
//         if($(this).text().length != 0 )
//           title=$(this).text();
//       console.log(title);
//   });
// });
