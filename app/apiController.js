var dataController = require('./dataController.js');
var fileUploadController = require('./fileUploadController.js');

module.exports = function(app, io, upload) {
io.on('connection',function(socket){
	socket.on('disconnect', function(){
	});
});
// API Calls
//Members
/**
 * @api {get} /api/ssnoc/directory List all members in the directory
 * @apiGroup Member
 * @apiName GetMembers
 *
 * @apiSuccess {String} JSON with members information.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{"name":"test","password":"1234","status":0,"_id":2,"__v":0}]
 */
	app.get('/api/ssnoc/directory', function(req, res) {
		dataController.getMembers(res);
	});

/**
 * @api {get} /api/ssnoc/member:name List member information
 * @apiGroup Member
 *
 * @apiName GetMember
 *
 * @apiParam {String} user name
 *
 * @apiSuccess {String} JSON with member information.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{"name":"test","password":"1234","status":0,"_id":2,"__v":0}]
 */

	app.get('/api/ssnoc/member/:name', function(req, res) {
		dataController.getMember(req, res);
	});

	app.get('/api/ssnoc/memberModel/:member_id', function(req, res) {
		dataController.getMemberById(req, res);
	});

/**
 * @api {post} /api/ssnoc/update_status/:member_id/:status_id Update member status
 * @apiGroup Member
 *
 * @apiName UpdateStatus
 *
 * @apiParam {Number} user id
 *
 * @apiParam {Number} status id
 *
 * @apiSuccess {String} JSON with member information.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{"name":"test","password":"1234","status":0,"_id":2,"__v":0}]
 */

	app.post('/api/ssnoc/update_status/:member_id/:latitude/:longitude/:status_id', function(req, res) {
		dataController.updateStatus(req,res,io);
	});

/**
 * @api {post} /api/ssnoc/member/:name/:pass Add members to directory
 * @apiGroup Member
 *
 * @apiName AddMember
 *
 * @apiSuccess {String} JSON with member information.
 *
 * @apiParam {String} user name
 *
 * @apiParam {String} password
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{ message: 'Status updated: Member 3 status is 2 }]
 */

	app.post('/api/ssnoc/member/:name/:pass', function(req, res) {
		dataController.addMember (req, res);
	});

/**
 * @api {delete} /api/ssnoc/update_status/:member_id/:status_id Remove member from directory
 * @apiGroup Member
 *
 * @apiName RemoveMember
 *
 * @apiSuccess {String} JSON with member information.
 *
 * @apiParam {Number} member_id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{ message: 'Member Test successfully removed' }]
 */

	app.delete('/api/ssnoc/member/:member_id', function(req, res) {
		dataController.removeMember(req.params.memeber_id, res);
	});

//Chat
/**
 * @api {post} /api/ssnoc/message/:member_id/:message Add message to chat
 * @apiGroup Messages
 *
 * @apiName AddMessage
 *
 * @apiSuccess {String} JSON with message information.
 *
 * @apiParam {String} member id
 *
 * @apiParam {String} message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"}
 */
	app.post('/api/ssnoc/message/:member_id/:latitude/:longitude/:message', function(req, res) {
		dataController.addPublicMessage(req, res, io);
	});

	app.post('/api/ssnoc/test/add_message/:member_id/:latitude/:longitude/:message', function(req, res) {
		dataController.addTestMessage(req, res, io);
	});

/**
 * @api {post} /api/ssnoc/announcement/:member_id/:message Post an announcement
 * @apiGroup Messages
 *
 * @apiName PostAnnouncement
 *
 * @apiSuccess {String} JSON with message information.
 *
 * @apiParam {String} member id
 *
 * @apiParam {String} message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"}
 */
	app.post('/api/ssnoc/announcement/:member_id/:latitude/:longitude/:message', function(req, res) {
		dataController.addAnnouncement(req, res, io);
	});

/**
 * @api {post} /api/ssnoc/privateMessage/:member_id/:receiver_id/:message Add private message to chat
 * @apiGroup Messages
 *
 * @apiName AddPrivateMessage
 *
 * @apiSuccess {String} JSON with message information.
 *
 * @apiParam {String} member id
 *
 * @apiParam {String} receiver id
 *
 * @apiParam {String} message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"message":"First message","member_id":3,"receiver_id":2,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"}
 */
	app.post('/api/ssnoc/private_message/:member_id/:latitude/:longitude/:receiver_id/:message', function(req, res) {
		dataController.addPrivateMessage(req, res, io);
	});


/**
 * @api {get} /api/ssnoc/messages Get all messages from history
 * @apiGroup Messages
 * @apiName GetPublicMessages
 *
 * @apiSuccess {String} JSON with messages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */
	app.get('/api/ssnoc/messages', function(req,res) {
		dataController.getPublicMessages(res);
	});

	app.get('/api/ssnoc/test/get_message', function(req,res) {
		dataController.getTestMessage(res);
	});

	app.post('/api/ssnoc/test/reset', function(req,res) {
		dataController.resetTest(res);
	});

/**
 * @api {get} /api/ssnoc/announcements Get all announcements from history
 * @apiGroup Messages
 * @apiName GetAnnouncements
 *
 * @apiSuccess {String} JSON with messages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First announcement","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second announcement","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */
	app.get('/api/ssnoc/announcements', function(req,res) {
		dataController.getAnnouncements(res);
	});

/**
 * @api {get} /api/ssnoc/messages Get all messages from history
 * @apiGroup Messages
 * @apiName GetPrivateMessages
 *
 * @apiSuccess {String} JSON with messages.
 * 
 * @apiParam {String} member id
 *
 * @apiParam {String} receiver id
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */
	app.get('/api/ssnoc/private_messages/:member_id/:receiver_id', function(req, res) {
		dataController.getPrivateMessages(req,res);
	});


//Search Function
/**
 * @api {get} /api/ssnoc/messages Get all messages from history
 * @apiGroup Search
 * @apiName SearchPublicMessages
 *
 * @apiSuccess {String} JSON with messages.
 * 
 * @apiParam {String} member id
 *
 * @apiParam {String} receiver id
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */

	app.get('/api/ssnoc/search_public_messages/:search_message',function(req,res){
		dataController.searchPublicMessages(req, res);
	});

/**
 * @api {get} /api/ssnoc/messages Get all messages from history
 * @apiGroup Search
 * @apiName SearchPrivateMessages
 *
 * @apiSuccess {String} JSON with messages.
 * 
 * @apiParam {String} member id
 *
 * @apiParam {String} receiver id
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */

	app.get('/api/ssnoc/search_private_messages/:search_message/:member_id/:receiver_id',function(req,res){
		dataController.searchPrivateMessages(req, res);
	});

/**
 * @api {get} /api/ssnoc/messages Get all messages from history
 * @apiGroup Search
 * @apiName SearhAnnouncements
 *
 * @apiSuccess {String} JSON with messages.
 * 
 * @apiParam {String} member id
 *
 * @apiParam {String} receiver id
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */

	app.get('/api/ssnoc/search_announcements/:search_message',function(req,res){
		dataController.searchAnnouncements(req, res);
	});

/**
 * @api {get} /api/ssnoc/messages Get all messages from history
 * @apiGroup Search
 * @apiName SearchMemberNames
 *
 * @apiSuccess {String} JSON with messages.
 * 
 * @apiParam {String} member id
 *
 * @apiParam {String} receiver id
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */

	app.get('/api/ssnoc/search_membername/:search_message',function(req,res){
		dataController.searchMemberNames(req, res);
	});

/**
 * @api {get} /api/ssnoc/messages Get all messages from history
 * @apiGroup Search
 * @apiName SearchMemberStatus
 *
 * @apiSuccess {String} JSON with messages.
 * 
 * @apiParam {String} member id
 *
 * @apiParam {String} receiver id
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */
	app.get('/api/ssnoc/search_memberstatus/:search_message',function(req,res){
		dataController.searchMemberStatus(req, res);
	});

/**
 * @api {get} /api/ssnoc/messages Get all messages from history
 * @apiGroup Search
 * @apiName SearchMemberStatus
 *
 * @apiSuccess {String} JSON with messages.
 * 
 * @apiParam {String} member id
 *
 * @apiParam {String} receiver id
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *[{"message":"First message","member_id":3,"status":1,"_id":2,"__v":0,"timestamp":"2015-10-09T08:38:00.456Z"},
 *{"message":"Second message","member_id":3,"status":1,"_id":3,"__v":0,"timestamp":"2015-10-09T08:38:03.237Z"}]
 */
	app.post('/api/ssnoc/upload_image',function(req,res){
		//add url in db

		var obj = JSON.stringify(req.body);
		var data = JSON.parse(obj);

		fileUploadController.uploadImage(data,res, function(){
			
		});
		
	});

//Files

	app.get('/chatting', function(req, res) {
		appRoot = __dirname + '/../public/ChatPublicly.html';
		res.sendFile(appRoot); // load the single view file (angular will handle the page changes on the front-end)
	});
	
	app.get('*', function(req, res) {
		appRoot = __dirname + '/../public/index.html';
		res.sendFile(path.join(appRoot)); // load the single view file (angular will handle the page changes on the front-end)
	});
};
