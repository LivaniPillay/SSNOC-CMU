app.factory('ssnocService',function($http) {
			
       var service = {
        
			getDirectory : function() {
				return $http.get('/api/ssnoc/directory');
			},
			getMember : function(username) {
				return $http.get('/api/ssnoc/member/'+ username);
			},
			create : function(member) {
				return $http.post('/api/ssnoc/member/'+ member.username +"/"+member.password);
			},
			updateStatus : function(member_id, position, status_id){
				return $http.post('/api/ssnoc/update_status/'+member_id + '/' + position.lat + "/" + 
					position.lng +"/"+status_id);
			},			
			addPublicMessage : function(message, position, user_id){
		  		return $http.post('/api/ssnoc/message/' + user_id + '/' + position.lat + "/" +
		  			position.lng + "/"+ message);
			},
			getPublicMessages : function(){
				return $http.get('/api/ssnoc/messages');
			},
			addAnnouncement : function(message, position, user_id){
		  		return $http.post('/api/ssnoc/announcement/' + user_id + '/' + position.lat + "/" +
		  			position.lng + '/' + message);
			},
			getAnnouncements : function(){
				return $http.get('/api/ssnoc/announcements');
			},
			addPrivateMessage : function (message, position, senderId, receiverId){
		  		return $http.post('/api/ssnoc/private_message/' + senderId + '/' + position.lat + "/" + 
		  			position.lng + '/' + receiverId + '/' + message);
			},
			getPrivateMessage : function (senderId, receiverId){
		  		return $http.get('/api/ssnoc/private_messages/' +senderId +'/' + receiverId);
			},
			getMemberById : function(memberId){
				return $http.get('api/ssnoc/memberModel/'+ memberId);
			},

			searchPublicMessages :function (searchMessage){
				return $http.get('/api/ssnoc/search_public_messages/' + searchMessage);
			},

			searchPrivateMessages :function (searchPrivateMessage,senderId, receiverId){
				return $http.get('/api/ssnoc/search_private_messages/' + searchPrivateMessage + '/' + 
					senderId + '/' + receiverId);
			},
			searchAnnouncements :function (searchAnnouncement){
				return $http.get('/api/ssnoc/search_announcements/' + searchAnnouncement);
			},
			searchMemberNames :function (searchMemberName){
				return $http.get('/api/ssnoc/search_membername/' + searchMemberName);
			},
			searchMemberStatus :function (searchByStatus){
				return $http.get('/api/ssnoc/search_memberstatus/' + searchByStatus);
			},
			testSendMessage : function(message, position, user_id){
				console.log("service::testSendMessage");
		  		return $http.post('/api/ssnoc/test/add_message/' + user_id + '/' + position.lat + "/" + 
		  			position.lng + "/"+ message);
			},
			testGetMessage : function(){
				return $http.get('/api/ssnoc/test/get_message');
			},
			testReset : function(){
				return $http.post('/api/ssnoc/test/reset');
			},
			uploadImage : function(fileData){

				var fd = new FormData();
				for(var key in fileData)
				{
					fd.append(key,fileData[key]);
				}	

				//console.log("File data " + fileData);

				return $http.post('/api/ssnoc/upload_image/', fileData, {
		            transformRequest: angular.identity,
		            headers: {'Content-Type:': undefined}});

			}
			// delete : function(id) {
			// 	return $http.delete('/api/ssnoc/' + id);
			// }
		};

		return service;

});