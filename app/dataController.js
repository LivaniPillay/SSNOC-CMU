var Member = require('./models/memberModel');
var Message = require('./models/messageModel');
var TestMessage = require('./models/testMessageModel');
var path = require('path');

var public_receiver = 0;
var announcement_receiver = 1;


exports.getMembers = function(res){
	Member.find(function(err, members) {

			if (err) {
				return res.send(err);	
			}

			res.json(members);
		});
};

exports.getMember = function(req, res){	
	Member.findOne({name: req.params.name}, function(err, members) {
			if (err) {			
				return res.send(err);	
			}
			res.json(members); 
	});
};


exports.getMemberById = function(req, res){
	Member.findOne({_id: req.params.member_id}, function(err, member) {
			if (err) {
				return res.send(err);	
			}

			res.json(member); 
		});
};

exports.addMember = function(req, res) {

	member = new Member({name: req.params.name, password: req.params.pass, status: 0});
	
	member.save(function (err, obj) {	  
		if (err) {
			return res.send(err);
		}
		res.json(member);
	});
};

exports.removeMember = function(id, res) {
	Member.remove({_id: id}, function(err, obj) {
        if (err) {
            res.send(err);
        }

        res.json({ message: 'Member '+ id + ' successfully removed' });
    });
};

exports.updateStatus = function(req, res, io) {
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	Member.findById(req.params.member_id, function(err, member) {
			if (err) {
				return res.send(err);
			}

		member.status = req.params.status_id;

		member.save(function(err) {
			if (err) {
				return res.send(err);
			}
			io.emit('userStatusChange');
			res.json({ message: 'Status updated: Member ' + req.params.member_id + ' status is ' + req.params.status_id +
				'and location is ' + latitude + ' ; ' + longitude});

		});
	});
};

exports.addPublicMessage = function(req, res, io) {
	var member_id = req.params.member_id;
	var message = req.params.message;
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	Member.findById(member_id, function(err, member) {
		if (err) {
			return res.send(err);
		}

		if (member !== null && member !== undefined) {
		
			mymessage = new Message({message: message, member_id: member_id, status: member.status,
			 position: {lng: longitude, lat: latitude}});
			
			mymessage.save(function (err, obj) { 
				if (err) {
					return res.send(err);
				}
				io.emit('message', mymessage);
				res.json(mymessage);
			});
		}
	});

};

exports.addTestMessage = function(req, res, io) {
	var member_id = req.params.member_id;
	var member_status = 1;
	var message = req.params.message;
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	Member.findById(member_id, function(err, member) {
		if (err) {
			return res.send(err);
		}

		testmessage = new TestMessage({message: message, member_id: member_id, status: member_status,
		 position: {lng: longitude, lat: latitude}});
		
		testmessage.save(function (err, obj) { 
			if (err) {
				return res.send(err);
			}
			io.emit('testmessage', mymessage);
			res.json(testmessage);
		});
	});

};

exports.addAnnouncement = function(req, res, io) {
	var member_id = req.params.member_id;
	var message = req.params.message;
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	Member.findById(member_id, function(err, member) {
		if (err) {
			return res.send(err);
		}

		if (member !== null && member !== undefined) {
		
			mymessage = new Message({message: message, member_id: member_id, receiver_id: announcement_receiver,status: member.status,
			 position: {lng: longitude, lat: latitude}});
			
			mymessage.save(function (err, obj) { 
				if (err) {
					return res.send(err);
				}

				io.emit('message', mymessage);
				res.json(mymessage);
			});
		}
	});

};

exports.getPublicMessages = function(res){
    Message.find({
    	$or: [{receiver_id: public_receiver},{receiver_id: announcement_receiver}]
    }, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        });
};

exports.getTestMessage = function(res){
    TestMessage.find({}, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        }).limit(1);
};

exports.resetTest = function(res){
    TestMessage.inventory.remove();
};

exports.getAnnouncements = function(res){
    Message.find({receiver_id: announcement_receiver}, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        });
};

exports.getPrivateMessages = function(req,res){

	Message.find({
				$or:[
				{$and: [{member_id: req.params.member_id}, {receiver_id: req.params.receiver_id}]},
				{$and: [{receiver_id: req.params.member_id}, {member_id: req.params.receiver_id}]}]
			},
		function(err, messages) {
			if (err) {
				return res.send(err);	
			}

			res.json(messages); 
		});
};

exports.addPrivateMessage = function(req, res, io){
	var member_id = req.params.member_id;
	var message = req.params.message;
	var receiver_id = req.params.receiver_id;
	var latitude = req.params.latitude;
	var longitude = req.params.longitude;

	Member.findById(member_id, function(err, member) {
		if (err) {
			return res.send(err);
		}
		if (member !== null && member !== undefined) {
			Member.findById(receiver_id, function(err,receiver){
				if (receiver !== null && receiver !== undefined) {
				
					mymessage = new Message({message: message, member_id: member_id, receiver_id: receiver_id,status: member.status,
			 				position: {lng: longitude, lat: latitude}});
					
					mymessage.save(function (err, obj) { 
						if (err) {
							return res.send(err);
						}

						io.emit('privatemessage', mymessage);
						res.json(mymessage);
					});
				}
			});
		}
	});
};


exports.searchPublicMessages = function(req,res){
	var search_message = req.params.search_message;
  search_message = search_message.replace(/ +/g, '|');
	Message.find( { $and: [ {message: new RegExp(search_message)},
                          {receiver_id: public_receiver}]
        
          }, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        }).sort( { timestamp: -1 } );
};

exports.searchPrivateMessages = function(req,res){
	var search_message = req.params.search_message;
  search_message = search_message.replace(/ +/g, '|');
	Message.find( { $and: [{message: new RegExp(search_message)},
		{$or:[
				{$and: [{member_id: req.params.member_id}, {receiver_id: req.params.receiver_id}]},
				{$and: [{receiver_id: req.params.member_id}, {member_id: req.params.receiver_id}]}
				]}
					]

					}, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        }).sort( { timestamp: -1 } );	
};

exports.searchAnnouncements = function(req,res){
	var search_message = req.params.search_message;
  search_message = search_message.replace(/ +/g, '|');
	Message.find( { $and: [{message: new RegExp(search_message)},
												 {receiver_id: announcement_receiver}]

				}, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        }).sort( { timestamp: -1 } );
};

exports.searchMemberNames = function(req,res){
              
	var search_membername = req.params.search_message;
	Member.find({name: new RegExp(search_membername)}, function(err, messages) {

            if (err) {
            }

            res.json(messages); 
        });
 	 return res.send(err);    
};

exports.searchMemberStatus = function(req,res){
  var search_memberstatus = req.params.search_message;
  Member.find({status: search_memberstatus }, function(err, messages) {

            if (err) {
                return res.send(err);    
            }

            res.json(messages); 
        });
};



