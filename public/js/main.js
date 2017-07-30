// Wait for the DOM to be loaded.
window.onload = init;

// Initialize the supporting JS file.
function init(){
	loadImages();
	addEventListeners();
};

// Bind events to the DOM elements.
function addEventListeners(){
    var formEvent = document.getElementById('uploadImg');
    formEvent.addEventListener('submit', formSubmitHandler);
}

// Submit the form with image data and call the respective API.
function formSubmitHandler(event){
    var data = $(event.currentTarget).serializeArray();
    
    $("#btnsubmit").attr("disabled","disabled");
    $.ajax({
        url: '/api/uploadImage',
        type: 'POST',
        data: data,
        success: function (resp) {
            loadImages();
            $("#btnsubmit").removeAttr("disabled");
        },
        error: function (err) {
            $("#btnsubmit").removeAttr("disabled");
        }
    });
}

// Call the service API to fetch images from cloudinary.com and display it on the screen.
function loadImages(){
	$("#btnShow").attr("disabled","disabled");
    $.ajax({
        url: '/api/listAllUploadedImages',
        type: 'GET',
        success: function (resp) {           
            if(resp){
                resp = JSON.parse(resp);
                if(resp.resources){
                    $(".imageViewer").html("");
                    for(var index in resp.resources){
                        var data = resp.resources[index];
                        var imgs = '<img src="'+data.url+'"/>'
                        $(".imageViewer").append(imgs);
                    }
                    $("#btnShow").removeAttr("disabled");               
                }
            }
        },
        error: function (err) {            
            $(".btnShow").removeAttr("disabled");
            console.log(err)
        }
    });
}