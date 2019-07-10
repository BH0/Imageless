var express = require('express');
var router = express.Router();
const request = require("request"); 
const cheerio = require("cheerio"); 
const path = require('path');
const fs = require("fs"); 

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

router.post("/", (req, res, next) => { 
  request(req.body.url, (error, response, html) => { 
    if (!error && response.statusCode == 200) { 
      const $ = cheerio.load(html); 

      // from https://stackoverflow.com/questions/36011918/replace-the-attribute-value-using-cheerio 
      $("img").each(function() {
        var old_src = $(this).attr("src");
        var new_src = "no-images-here";
        $(this).attr("src", new_src);            
        $(this).attr("srcset", new_src);            
      });

      let imageless = $.html(); 
      
      fs.writeFile(path.join(`${__dirname}/../public/imageless.html`), imageless, function(err) { 
      if (err) {
            return console.log(err);
        }
        res.redirect("/imageless"); 
      }); 
    }
  }); 
}); 

router.get('/imageless', function(req, res, next) {
  res.sendFile(path.join(`${__dirname}/../public/imageless.html`));
});

module.exports = router;
