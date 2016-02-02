app.controller("performanceTestController",function($scope, ssnocService, $q,$rootScope){
    $scope.messages = [];
    $scope.announcements = [];
    
    var testMessage = "20characters message";
    var position = {lat:'0', lng:'0'};
    $scope.delay = 500;
    var fakeUser = 999;
    var defer = $q.defer();
    $scope.countCalls = 0;
    $scope.resultTime = 0;

    $scope.performTest = function(){

     var startTime = new Date().getTime();
     $scope.countCalls = 0;
     $scope.resultTime = 0;

     console.log("delay " + $scope.delay);

      runPerformance(startTime, function(result){
        $scope.resultTime = new Date().getTime() - startTime;
            
        console.log("Perfomance: " + result + " " + $scope.resultTime);  
    
          console.log("Reset database!!!!!");
          ssnocService.testReset();
       });

    };

    function runPerformance(startTime, callback)
    {
     var interval =  setInterval(function(){
          testSendMessage();          
          testGetMessage();

          $scope.countCalls++;
          if(new Date().getTime() > startTime + $scope.delay){
             clearInterval(interval);
             callback($scope.countCalls);
           }
        },5); 
    }


    function testSendMessage(){
      ssnocService.testSendMessage(testMessage, position, fakeUser);
    }
     
    function testGetMessage(){
        ssnocService.testGetMessage()
        .success(function(response)
        {
          $scope.messages = response;
        });
    }
});