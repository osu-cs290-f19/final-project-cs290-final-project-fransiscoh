var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var multer = require('multer');
var upload = multer({dest: __dirname + '/uploads/images'});

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get("/", function(req, res, next) {
    res.status(200).render("index", {});
});

app.get("/about", function(req, res, next) {
    res.status(200).render("about", {});
});

app.use(express.static('public'));

app.post('/upload', upload.single('photo'), (req, res) => {
    if(req.file) {
        res.json(req.file);
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