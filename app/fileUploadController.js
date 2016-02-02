// var Member = require('./models/memberModel');
// var Message = require('./models/messageModel');
// var TestMessage = require('./models/testMessageModel');
var path = require('path');
var fs = require('fs');

exports.uploadImage = function(data, res){

	var result = data.file.replace(/^data:image\/\w+;base64,/, "");
	var file = new Buffer(result, 'base64');
	var uploadUrl ='uploadImages/image.png';

	fs.writeFile(uploadUrl, file, function(err, response){
		if(err) {
			throw err;
		}
         //send back the preview url
         return res.json({ success: true, fileUrl: uploadUrl});	
	});

};

exports.customFileWriter = function(file, filename){
	var uploadUrl = "uploadImages/" + filename;
	fs.writeFile(uploadUrl, file, function(err, response){
		if(err) {
			return err;
		}  
		console.log(uploadUrl);
		
	});
	return uploadUrl;
};