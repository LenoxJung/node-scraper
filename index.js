var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var csvWriter = require('csv-write-stream');
var writer = csvWriter({ headers: ["FilePermission","AbsoluteURL","FileType"]})
request('http://substack.net/images/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(body)
    $('tr').each(function(i, elem){
      var allTds = $(this).find('td');
      var filePermission = allTds.eq(0).find('code').text();
      var absoluteURL = 'http://substack.net' + allTds.eq(2).find('a').attr('href');
      var fileType = allTds.eq(2).find('a').text();
      writer.pipe(fs.createWriteStream('images.csv'));
      writer.write([filePermission, absoluteURL, fileType]);
      writer.end
    });
    console.log("file created");
  }
})