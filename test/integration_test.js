var should = require('should'); 
var request = require('supertest');
var tungus   = require('tungus');
var mongoose = require('mongoose'); 					// mongoose for tingoDb
var apiController = require('../app/apiController.js');

var express = require('express');
var status = require('httpstatus');
var superagent = require('superagent');
var expect = require('expect');
var assert = require('assert');

mongoose.connect('tingodb://'+__dirname+'/../ssnocdb/', function (err) {
  if (err){
  	throw err;
  } else {
  	console.log("Integration: connected to tingodb");
  	console.log('Running mongoose version %s', mongoose.version);
  }
});

describe('/api', function(){
	var url = 'http://localhost:2222';
	var app;

	before(function(){
		server = new express();
		app  = require('http').Server(server);
	});


	after(function(){
		app.close();
	});

	it('returns member if the member id is valid', function(done){
		superagent.get(url + '/api/ssnoc/memberModel/1').end(function(err,res){
			assert.ifError(err);
			assert.equal(res.status, status.OK);
			var result = JSON.parse(res.text);
			asert.deepEqual({user:'test'},result);
			done();
		});
	});

});



//suite('REST API', function() {


// 	var url = 'http://localhost:2222';

// 	mongoose.connect('tingodb://'+__dirname+'/../ssnocdb/');

// 	test('Members', function() {
// 		request(url)
// 		.get('/api/ssnoc/directory')
// 		.end(function(err, res) {
// 			if (err) {
// 				throw err;
// 			}
//           // this is should.js syntax, very clear
//           res.should.have.status(400);
//           done();
//       });
// 	});

// 	test('Specific Member', function() {
// 		request(url)
// 		.get('/api/ssnoc/member/bruno')
// 		.end(function(err, res) {
// 			if (err) {
// 				throw err;
// 			}
//           // this is should.js syntax, very clear
//           res.should.have.status(400);
//           done();
//       });
// 	});

// 	test('Announcements', function() {
// 		request(url)
// 		.get('/api/ssnoc/annoucements')
// 		.end(function(err, res) {
// 			if (err) {
// 				throw err;
// 			}
//           // this is should.js syntax, very clear
//           res.should.have.status(400);
//           done();
//       });
// 	});

// 	test('Messages', function() {
// 		request(url)
// 		.get('/api/ssnoc/messages')
// 		.end(function(err, res) {
// 			if (err) {
// 				throw err;
// 			}
//           // this is should.js syntax, very clear
//           res.should.have.status(400);
//           done();
//       });
// 	});

// 	test('UpdateStatus', function() {
// 		request(url)
// 		.post('/api/ssnoc/update_status/2/0/0/1')
// 		.end(function(err, res) {
// 			if (err) {
// 				throw err;
// 			}
//           // this is should.js syntax, very clear
//           res.should.have.status(400);
//           done();
//       });
// 	});

// 	test('addMember', function() {
// 		request(url)
// 		.get('/api/ssnoc/member/mike/12345')
// 		.end(function(err, res) {
// 			if (err) {
// 				throw err;
// 			}
//           // this is should.js syntax, very clear
//           res.should.have.status(400);
//           done();
//       });
// 	});

// 	test('Messages', function() {
// 		request(url)
// 		.get('/api/ssnoc/messages')
// 		.end(function(err, res) {
// 			if (err) {
// 				throw err;
// 			}
//           // this is should.js syntax, very clear
//           res.should.have.status(400);
//           done();
//       });
// 	});

// 	test('addMessage', function() {
// 		request(url)
// 		.get('/api/ssnoc/message/2/0/0/NewMessage')
// 		.end(function(err, res) {
// 			if (err) {
// 				throw err;
// 			}
//           // this is should.js syntax, very clear
//           res.should.have.status(400);
//           done();
//       });
// 	});

// 	test('New Announcement', function() {
// 		request(url)
// 		.post('/api/ssnoc/message/2/0/0/NewAnnouncement')
// 		.end(function(err, res) {
// 			if (err) {
// 				throw err;
// 			}
//           // this is should.js syntax, very clear
//           res.should.have.status(400);
//           done();
//       });
// 	});

// 	test('Upload Image', function() {
// 		request(url)
// 		.post('/api/ssnoc/upload_image/')
// 		.end(function(err, res) {
// 			if (err) {
// 				throw err;
// 			}else{
// 				console.log(res);
// 			}
//           // this is should.js syntax, very clear
//           res.should.have.status(400);
//           done();
//       });
// 	});

		
//});

