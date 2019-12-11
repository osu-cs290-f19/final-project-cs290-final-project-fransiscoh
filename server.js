var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var multer = require('multer');
var upload = multer({dest: __dirname + '/public/uploads/images'});
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;

const model_path = "./SavedModel/saved_model";

async function get_model() {
    model = await tf.node.loadSavedModel(model_path);
}

get_model()

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get("/", function(req, res, next) {
    var uploadList = require('./uploads.json');
    res.status(200).render("index", {
        uploads: uploadList
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

app.post('/upscale/:imageName', function(req, res, next) {
    const image_path = "./public/uploads/images/" + req.params.imageName;
    console.log(image_path);
    main(model_path, image_path);
});

function image_data_to_tensor(image_data) {
    return tf.node.decodeImage(image_data, 3) // Decode with 3 channels
        .div(255.0)     // Make image intensities within 0.0 and 1.0
        .expandDims(0)  // Make it into one "Batch" for the neural net
        .toFloat();
}
 
async function tensor_to_png(tensor) {
    const integer_image = tensor
        .squeeze(0)     // Unbatch
        .maximum(0.0)   // Clamp between 0.0 and 1.0
        .minimum(1.0)
        .mul(255.0)     // Make image intensities fall within integer quantizations
        .toInt();
    return tf.node.encodePng(integer_image);
}

async function predict_png(image_data) {
    var image_tensor = image_data_to_tensor(image_data);
    console.log(image_tensor);
    const upsized_tensor = model.predict(image_tensor);
    console.log(upsized_tensor);
    return await tensor_to_png(upsized_tensor);
}

app.post('/infer', function(req, res, next) {
    req.on('data', function(dat) { 
        var buf = Buffer.from(dat, 'base64');
        predict_png(buf).then(function(upscaled_png) {
            let buff = new Buffer(upscaled_png);
            res.end(buff.toString('base64'));
        });
    });
});

app.get("*", function(req, res, next) {
    console.log("404 url:", req.url);
    res.status(404).render("404", {
        url: req.url
    })
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
