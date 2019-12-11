var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var multer = require('multer');
var fs = require('fs');
var upload = multer({dest: __dirname + '/public/uploads/images'});

var app = express();
var port = process.env.PORT || 3000;

var hbs = exphbs.create({
    helpers:  {
      favorite: function() { console.log('favorite test'); }
    }
})

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get("/", function(req, res, next) {
    var uploadList = require('./uploads.json');
    res.status(200).render("index", {
        uploads: uploadList
    });
});

app.get("/favorites", function(req, res, next) {
    var favoriteList = require('./uploads.json')
    res.status(200).render("favorites", {
        uploads: favoriteList
    });
});

app.get("/about", function(req, res, next) {
    res.status(200).render("about", {});
});

app.use(express.static('public'));

app.post('/upload', upload.single('photo'), (req, res, next) => {
    if(req.file) {
        var index = req.file.path.indexOf("uploads")-1;
        var path = req.file.path.substring(index);
        var image = {
            src: path,
            alt: req.file.originalname
        }
        // console.log(req.file);
        var imageList = require('./uploads.json');
        var write = true;
        // console.log(imageList);

        for(var i = 0; i < imageList.length; i++) {
            if(image.alt == imageList[i].alt) {
                write = false;
            }
        }

        if(write) {

            imageList.push(image);
        }

        fs.writeFile('./uploads.json', JSON.stringify(imageList), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        res.status(200).redirect("/");
    }
    else throw 'error';
});

// app.post('/path', upload.single('avatar'), function (req, res, next) {
//     // req.file is the `avatar` file
//     // req.body will hold the text fields, if there were any
//   })

app.get("*", function(req, res, next) {
    console.log("404 url:", req.url);
    res.status(404).render("404", {
        url: req.url
    })
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
