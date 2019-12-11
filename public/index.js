// window.addEventListener('load', function() {
//     this.document.querySelector('input[type="file"]').addEventListener('change', function() {
//         if(this.files && this.files[0]) {
//             var img = document.getElementById('myImg');
//             img.src = URL.createObjectURL(this.files[0]); // set src to blob url
//             // img.onload = imageIsLoaded;
//             console.log("image loaded");
//             console.log(img);
//         }
//     });
// });

function croppers(){
    const image = document.getElementsByClassName('img-container highlight')[0].getElementsByTagName('img')[0];
    var cropper = new Cropper(image, {
      aspectRatio: 1 / 1,
      wheelZoomRatio: 0,
      autoCropArea: 0,
      strict: false,
      guides: false,
      highlight: false,
      dragCrop: false,
      dragMode: 'move',
      cropBoxResizable: false,
      zoomOnWheel: false,
      scalable: false,
      zoomalbe: false,
      ready() {
        this.cropper.setCropBoxData({"width":60,"height":60});
      },
      crop(event) {
    
      },
    });
    
    var add = document.querySelector('#btnCrop');
    add.addEventListener('click', function(){
        var croppedImageDataURL = cropper.getCroppedCanvas().toDataURL("image/png");
        var cropped = document.createElement('img');
        cropped.setAttribute("src", croppedImageDataURL);
        document.getElementById('crops').appendChild(cropped);
    //    .append( $('<img>').attr('src', croppedImageDataURL));
        console.log(croppedImageDataURL);
    });
    }


var imageArray = document.getElementsByClassName("img-container");

for (var i = 0; i < imageArray.length; i++) {
    (function(index) {
         imageArray[index].addEventListener("click", function() {
            for(var j = 0; j < imageArray.length; j++) {
                if(index == j) {
                    imageArray[j].classList.add("highlight");
                    croppers();
                } else {   
                    imageArray[j].classList.remove("highlight");
                }
            }
          })
    })(i);
 }

var upscaleButton = document.getElementById("upscale-button");
upscaleButton.addEventListener("click", function () {
    var postRequest = new XMLHttpRequest();

    var selectedImgCont = document.getElementsByClassName("highlight");
    var path = selectedImgCont[0].firstElementChild.src;
    path = path.substring(path.indexOf("images") + 7);
    var requestURL = "/upscale/" + path;

    postRequest.open('POST', requestURL);
    postRequest.send();
});