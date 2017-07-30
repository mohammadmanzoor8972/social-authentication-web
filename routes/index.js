// Include the required modules.
var passportObj = require('../controllers/passportController').passportController;

// Redirect the call to the controller to upload image.
module.exports.FacebookAuthenticate = function(req, res) {
    
    passportObj.FacebookAuthenticate();
    res.end("success");
}


