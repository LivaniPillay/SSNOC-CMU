var should = require('should'); 
var request = require('supertest');
var tungus = require('tungus');
var mongoose = require('mongoose');
var dataController = require('../app/dataController.js');
var fileUploadController = require('../app/fileUploadController.js');


var expect = require('expect.js');

mongoose.connect('tingodb://'+__dirname+'/../ssnocdb/', function (err) {
  if (err){
  	throw err;
  } else {
  	console.log("Database controller : connected to tingodb");
  }
});memberModel

suite('file controller test', function(){
	test('upload file', function(done){
		var file = "test file";
		var filename = "testFile.txt";
		var response = 	fileUploadController.customFileWriter(file, filename);
		expect(response).to.be("uploadImages/" + filename);
		done();
	});
});



function getMemberFromDataController(req, res,callback){
	dataController.getMember(req, res);
	return callback(res);
}
