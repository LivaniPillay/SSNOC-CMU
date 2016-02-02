app.factory("fileReader",function($q, $log) {
     
    var fileReader = {
 
        onLoad : function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        },
    
        onError : function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        },
 
        onProgress : function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        },
 
        getReader : function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = fileReader.onLoad(reader, deferred, scope);
            reader.onerror = fileReader.onError(reader, deferred, scope);
            reader.onprogress =fileReader.onProgress(reader, scope);

            return reader;
        },
 
        readAsDataURL : function (file, scope) {
            var deferred = $q.defer();
             
            var reader = fileReader.getReader(deferred, scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        },
        compressImage : function(img){

                var deferred = $q.defer();

                var canvas = document.getElementById('canvas');
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var MAX_WIDTH = 800;
                var MAX_HEIGHT = 600;
                var width = img.width;
                var height = img.height;

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
                ctx.drawImage(img, 0, 0, width, height);

                var dataurl = canvas.toDataURL("image/png");
                console.log("Data url " + dataurl);
                document.getElementById('image').src = dataurl; 

                deferred.resolve(dataurl);
                return deferred.promise;
            }


        // return {
        //     readAsDataUrl: readAsDataURL  
        // };
    };
    return fileReader;
 
});