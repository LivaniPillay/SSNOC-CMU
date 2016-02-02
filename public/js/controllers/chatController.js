app.controller("chatController",function($scope, ssnocService, fileReader, $q,$rootScope){
  $scope.directory = {};
  $scope.directoryDict = {};
  $scope.loading = true;
  $scope.messages = [];
  $scope.announcements = [];
  $scope.chatMessage = "";
  $scope.searchMessage = "";
  $scope.searchAlert = false;
  $rootScope.currentMsgPage = 0;
  $scope.imageUpload= {};
  $scope.headCount = 0;
  $scope.statusMap = {
    "ok":1,
    "help":2,
    "emergency":3,
    "undefined":0
  };

  var defer = $q.defer();

  getDirectory();
  getAllMessages();
  getAnnouncements();

  $scope.isOnline = function(status)
  {
    if(status !== 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  };

  $scope.isAnnoucement = function(receiverId)
  {
    if(receiverId == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  };

  $scope.uploadImage = function(){

     $scope.faceDetection().then(function(result){
        $scope.headCount = $(".rect").length; 
        $scope.loading = false;
     });
      
      // ssnocService.uploadImage($scope.user.image).success(function(data){
      //   console.log("Image uploaded successfully");
      // });
  };

  function getDirectory()
  {
    $scope.loading = true;
    ssnocService.getDirectory()
    .success(function(data) {
      $scope.directory = data;
      for (var i = 0; i < $scope.directory.length; i ++) {
        var member = $scope.directory[i];
        $scope.directoryDict[member._id] = member;
      }
      $scope.loading = false;

    }); 
  }

  $scope.newPrivateChat = function(memberId){
    $rootScope.receiverId = memberId;
    window.location="/#/privatechat";
  };

  $scope.sendMessage = function(){
    ssnocService.addPublicMessage($scope.chatMessage, $rootScope.currentPosition, $rootScope.id);
  };

  $scope.postAnnouncement = function(){
    ssnocService.addAnnouncement($scope.chatMessage, $rootScope.currentPosition, $rootScope.id)
    .success(function(response){
      getAnnouncements();
    });
  };

  $rootScope.socket.on('message', function(msg){
    $scope.messages.push(msg);
    $scope.chatMessage = "";
    $scope.$apply();
  });

  $scope.msgAlert=false;

  $rootScope.socket.on('privatemessage', function(result){
   $scope.msgAlert=true; 
   $scope.$apply();
 });

  $rootScope.socket.on('userStatusChange', function(){
    getDirectory();
  });


  $( window ).unload(function() {
   ssnocService.updateStatus($rootScope.id, $rootScope.currentPosition, 0);
 });

  function getAllMessages(){
    console.log("getting messages");
    ssnocService.getPublicMessages()
    .success(function(response)
    {
      $scope.messages = response;
      $scope.messages.forEach(function(entry) {
        console.log("Position:" + entry.position);
      });

    });
  }

  function getAnnouncements(){
    console.log("getting messages");
    ssnocService.getAnnouncements()
    .success(function(response)
    {
      console.log(response);
      $scope.announcements = response;
    });
  }

    //search functions 
    var stopwords = ["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"];

    $scope.searchMessages = function(){
      $rootScope.currentMsgPage = 0;
      if (stopwords.indexOf($scope.searchMessage) == -1 ) {
        ssnocService.searchPublicMessages($scope.searchMessage)
        .success(function(response){
          if(response.length === 0){
            $scope.searchAlert = true;
            $scope.messages = [];
          }
          else{
            $scope.searchAlert = false;
            $scope.messages = response;
          }
        });
      }
      else {
        $scope.searchAlert = true;
        $scope.messages = [];
      } 
    };


    $scope.searchAnnouncements = function(){
     $rootScope.currentMsgPage = 0;
     if (stopwords.indexOf($scope.searchAnnouncement) == -1 ) {
      ssnocService.searchAnnouncements($scope.searchAnnouncement)
      .success(function(response){
        if(response.length === 0){
          $scope.searchAlert = true;
          $scope.announcements = [];
        }
        else{
          $scope.announcements = response;
          $scope.searchAlert = false;
        } 
      });
    }
    else {
      $scope.searchAlert = true;
      $scope.announcements = [];
    } 
  };

  $scope.searchMemberNames = function(){
    ssnocService.searchMemberNames($scope.searchMemberName)
    .success(function(response){
      if(response.length === 0){
        $scope.searchAlert = true;
        $scope.directory = [];
      }
      else{
        $scope.searchAlert = false;
        $scope.directory = response;
        for (var i = 0; i < $scope.directory.length; i ++) {
          var member = $scope.directory[i];
          $scope.directoryDict[member._id] = member;
        }
      }
    });
  };

  $scope.searchMemberStatus = function(){
    var search_status = $scope.searchByStatus.toLowerCase();
    if (search_status in $scope.statusMap)
    {
      ssnocService.searchMemberStatus($scope.statusMap[search_status])
      .success(function(response){
        if(response.length === 0){
          $scope.searchAlert = true;
          $scope.directory = [];
        }
        else{
          $scope.directory = response;
          for (var i = 0; i < $scope.directory.length; i ++) {
            var member = $scope.directory[i];
            $scope.directoryDict[member._id] = member;
          }
        }
      });
    }
  };

   $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataURL($scope.file, $scope)
                      .then(function(result) {
                          console.log("Result " + result);
                          var image = document.getElementById("image");
                          image.src = result;
                          var compressedImage = compressImage(image);
                          console.log("Compressed " + compressedImage);

                        $.ajax(
                        {
                            url: '/api/ssnoc/upload_image',
                            method: 'POST',
                            data: {file: compressedImage},
                            success: function(response) {
                               console.log(response);
                            },  

                        error: function(xhr, textStatus, errorThrown) {}
                        });
                   });
    };

    function compressImage(image) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        var MAX_WIDTH = 100;
        var MAX_HEIGHT = 100;
        var width = image.width;
        var height = image.height;

        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);

        var dataUrl = canvas.toDataURL("image/png");
        return dataUrl;
    }

    $scope.faceDetection = function(callback) {
        $scope.loading = true;
        var img = document.getElementById('image');
        var tracker = new tracking.ObjectTracker(['face']);
        tracker.setStepSize(0.5);
        tracking.track('#image', tracker);
        tracker.on('track', function(event) {
          event.data.forEach(function(rect) {
            window.plot(rect.x, rect.y, rect.width, rect.height);
          });
          $scope.headCount = $scope.headCount + $(".rect").length; 
          $scope.loading = false;
          $scope.$apply();
        });

        window.plot = function(x, y, w, h) {
          var rect = document.createElement('div');
          document.querySelector('.demo-container').appendChild(rect);
          rect.classList.add('rect');
          rect.style.width = w + 'px';
          rect.style.height = h + 'px';
          rect.style.left = (img.offsetLeft + x) + 'px';
          rect.style.top = (img.offsetTop + y) + 'px';
        };

        return defer.promise;

     };

});

app.directive("ngFileSelect", function () {
    return {
        link: function ($scope, el) {
            el.bind("change", function (e) {
                  $scope.file = (e.srcElement || e.target).files[0];
                  console.log("File  "  + $scope.file);
                  $scope.getFile();
            });
        }
    };
});
