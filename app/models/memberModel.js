var tungus = require('tungus');
var mongoose = require('mongoose');

module.exports = mongoose.model('Member', {name: String, password: String, status: Number, createdAt:{ type: Date, default: Date.now },
 lastLogin:{ type: Date, default: Date.now }});
