var tungus = require('tungus');
var mongoose = require('mongoose');

module.exports = mongoose.model('TestMessage', {message: String, member_id: Number, receiver_id: {type:Number, default: 0}, 
	status: Number, timestamp:{ type: Date, default: Date.now }, position:{lng: Number, lat: Number}});