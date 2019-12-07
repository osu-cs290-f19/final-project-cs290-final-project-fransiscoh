window.addEventListener('load', function() {
    this.document.querySelector('input[type="file"]').addEventListener('change', function() {
        if(this.files && this.files[0]) {
            var img = document.getElementById('myImg');
            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
            // img.onload = imageIsLoaded;
            console.log("image loaded");
            console.log(img);
        }
    });
});