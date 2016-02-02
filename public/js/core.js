var app = angular.module('ssnoc',['ngRoute', 'naif.base64','angularSpinner']);

app.config(['$routeProvider', function($routeProvider) {

      // $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        // $rootscope ="hello world",
        $routeProvider

            // route for the home page
            .when('/', {
              templateUrl : 'login.html',
              controller  : 'mainController'
            })

            // // route for the about page
            .when('/chatting', {
              templateUrl : 'chat.html',
              controller  : 'chatController'
            })

            .when('/directory',{
              templateUrl: 'directory.html',
              controller:'chatController'
            })

            .when('/inbox', {
              templateUrl : 'inbox.html',
              controller  : 'chatController'
            })

            .when('/announcements', {
              templateUrl : 'announcement.html',
              controller  : 'chatController'
            })

            .when('/privatechat', {
              templateUrl : 'privatechat.html',
              controller  : 'privateChatController'
            })

            .when('/performance', {
              templateUrl : 'performance.html',
              controller  : 'performanceTestController'
            });

          }]);

app.run(function($rootScope, ssnocService){

    $rootScope.id =0;    
    $rootScope.name ="";
    $rootScope.receiverId =0;
    $rootScope.status =0;
    $rootScope.socket = io.connect(); 
    $rootScope.currentPosition = {lat: 0, lng: 0};
    $rootScope.currentPosition.lat = 0;    
    $rootScope.currentPosition.lng = 0;    
    $rootScope.authenticated = false;
    $rootScope.statuses = [
    {name:"OK", id:1},
    {name:"Help", id:2},
    {name:"Emergency", id:3}
    ];

    $rootScope.statusImgMap = {
      0:"offline.png",
      1:"ok-icon.png",
      2:"help-icon.png",
      3:"emergency-icon.png",
    };

    $rootScope.currentMsgPage = 0;
    var pageSize = 10;
    
    getLocation();

    function getLocation(){
      navigator.geolocation.getCurrentPosition(showLocation);
    }

    function showLocation(position) {
      console.log("core::showLocation: %s", position);
      if(position!==undefined) {

        $rootScope.currentPosition = {lat: position.coords.latitude, lng: position.coords.longitude};
      }
    }

    $rootScope.shareStatus= function(status_id){
     //1-ok 2-help 3-emergency 0-logout

     console.log("update status in core" + status_id);
     $rootScope.status = status_id;
     ssnocService.updateStatus($rootScope.id, $rootScope.currentPosition, status_id);
      //ssnocService.updateStatus($rootScope.id, status_id);
    };

    $rootScope.logout = function()
    {
      ssnocService.updateStatus($rootScope.id, $rootScope.currentPosition, 0).
      success(function(response){
        console.log("logout" + response);
        $rootScope.authenticated = false;
        window.location = "/";
      });
    };

    $rootScope.socket.on('disconnect', function(){
      console.log("disconnecting" + $rootScope.id);
      ssnocService.updateStatus($rootScope.id, 0);
      $rootScope.$apply();
    });

    $rootScope.isSearchMsgShown = function(messageId, messages)
    {
      for (var i = 0; i < messages.length; i ++) {
        if (messages[i]._id == messageId) {
          if (i < ($rootScope.currentMsgPage+1) * pageSize) {
            return true;
          }
          else {
            return false;
          }
        }
      }
      return false;
    };

    $rootScope.isShowMoreButtonShown = function(messages) {
      if (($rootScope.currentMsgPage+1) * pageSize >= messages.length) {
        return false;
      }
      else {
        return true;
      }
    };

    $rootScope.showMore = function() {
      $rootScope.currentMsgPage += 1;
    };

  });


