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

var imageArray = document.getElementsByClassName("img-container");

for (var i = 0; i < imageArray.length; i++) {
    (function(index) {
         imageArray[index].addEventListener("click", function() {
            for(var j = 0; j < imageArray.length; j++) {
                if(index == j) {
                    imageArray[j].classList.add("highlight");
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