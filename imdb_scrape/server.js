var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var port = 8081;

app.get('/scrape', function(req, res){

    url = 'https://www.imdb.com/title/tt0415306/';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title, release, rating;
            var json = { title : "", release : "", rating : ""};

            // We'll use the unique header class as a starting point.

            $('.title_wrapper').filter(function() {

           // Let's store the data we filter into a variable so we can easily see what's going on.

                var data = $(this);

           // In examining the DOM we notice that the title rests within the first child element of the header tag. 
           // Utilizing jQuery we can easily navigate and get the text by writing the following code:

                title = data.children().first().text();

                release = data.children().last().children().last().text();

           // Once we have our title, we'll store it to the our json object.

                json.title = title;

                json.release=release;

                //release is in different part of DOM
                $('.ratingValue').filter(function() {
                    var data = $(this);

                    rating = data.children().first().children().first().text();

                    json.rating=rating;
                })


            // To write to the system we will use the built in 'fs' library.
            // In this example we will pass 3 parameters to the writeFile function
            // Parameter 1 :  output.json - this is what the created filename will be called
            // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
            // Parameter 3 :  callback function - a callback function to let us know the status of our function

            fs.writeFile('output.json', JSON.stringify(json, null,4), function(err)
                {

                    console.log('File successfully written! - Check your project directory for the output.json file');
                })
                res.send('Check your console!')
                
            });
        }
    })
})

app.listen(port)
console.log('Magic happens on port ' + port );
exports = module.exports = app;

