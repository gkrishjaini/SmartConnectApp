smartApp.controller('closingCtrl', ['$scope', '$rootScope', '$window', '$http', '$location', '$filter', '$cordovaCamera', '$mdDialog', '$state', '$stateParams', function ($scope, $rootScope, $window, $http, $location, $filter, $cordovaCamera, $mdDialog, $state, $stateParams) {
  $scope.CircularLoader = true
  var id = storage.getItem('userId');
  var date = new Date();
  var dateAsString = $filter('date')(date, "yyyy-MM-dd");
  //var selectedAppointment = $state.params.selectedAppointment;
  var images = [];
  var $imagesDiv;

  // if (selectedAppointment) {
  //   var customerID = selectedAppointment.customerID;
  //     $scope.apointmentId = selectedAppointment._id;
  //     $http.get("http://smartconnection.herokuapp.com/api/customer/customerDetails/customer/" + customerID, {
  //       headers: {
  //         'x-access-token': storage.getItem('loginToken')
  //       }
  //     }).success(function (result) {
  //       $scope.CustomerDetails = result;
  //     }).error(function (error) {
  //       //$window.alert("Error");
  //     });
  //   //$scope.getCustomerDetails(selectedAppointment);
  //   $scope.section = {
  //     section2: true
  //   };
  // } else {
  $scope.section = {
    section1: true
  };
  //}
  document.addEventListener("deviceready", init, false);
  function init() {

    $("#addPicture").on("touchend", selPic);
    $imagesDiv = $("#images");
    $("#uploadPictures").on("touchend", uploadPics);
  }

  function selPic() {
    navigator.camera.getPicture(function (f) {
      var newHtml = "<img src='" + f + "'>";
      $imagesDiv.append(newHtml);
      images.push(f);
      if (images.length === 1) {
        $("#uploadPictures").removeAttr("disabled");
      }
    }, function (e) {
      // alert("Error, check console.");
      console.dir(e);
    }, {
        quality: 50,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.FILE_URI
      });

  }

  function uploadPics() {
    if (images.length == 0) {
      closeAppointment();
    }
    else {
      console.log("Ok, going to upload " + images.length + " images.");
      var defs = [];

      images.forEach(function (i) {
        console.log('processing ' + i);
        var def = $.Deferred();

        function win(r) {
          console.log("thing done");
          if ($.trim(r.response) === "0") {
            console.log("this one failed");
            def.resolve(0);
          } else {
            console.log("this one passed");
            def.resolve(1);
          }
        }

        function fail(error) {
          console.log("upload error source " + error.source);
          console.log("upload error target " + error.target);
          def.resolve(0);
        }

        var uri = encodeURI("http://smartconnection.herokuapp.com/api/serviceprovider/closingAttachmentUploads");

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = i.substr(i.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";

        data = {
          "empId": $rootScope.user.id,
          "appointmentId": $scope.apointmentId
        }

        var headers = { 'x-access-token': storage.getItem('loginToken') };
        options.headers = headers;
        options.params = data;

        var ft = new FileTransfer();
        ft.upload(i, uri, win, fail, options);
        defs.push(def.promise());

      });

      $.when.apply($, defs).then(function () {
        console.log("all things done");
        console.dir(arguments);
        closeAppointment();

      });
    }
  }
  function closeAppointment() {
    $scope.CircularLoader = false;
    var data = {
      "employeeId": $rootScope.user.id,
      "appointmentId": $scope.apointmentId,
      "comments": $scope.comments
    };
    $http.post("http://smartconnection.herokuapp.com/api/serviceProvider/closeAppointment/", data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': storage.getItem('loginToken')
      }
    }).success(function (result) {
      $scope.CircularLoader = true;
      if (result.success == true) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .textContent(result.message)
            .ariaLabel('Alert Dialog Demo')
            .ok('OK')
        );
        $scope.images = null;
        $location.path('/home');
      }
      console.log(result);
    }).error(function (error) {
       $scope.CircularLoader = true;
    });
  }


  // $scope.images = [];
  // $scope.displayGalleyFiles = function () {
  //   var fOptions = {
  //     limit: 10,
  //     destinationType: Camera.DestinationType.FILE_URI,
  //     sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
  //     quality: 100,
  //     width: 200,
  //     height: 200
  //   };

  //   window.imagePicker.getPictures(
  //     function (results) {
  //       console.log(results)
  //       for (var i = 0; i < results.length; i++) {
  //         console.log('Image URI: ' + results[i]);
  //         $scope.images.push(results[i])
  //       }
  //       console.log($scope.images);
  //       //uploadPics();
  //     },
  //     function (error) {
  //       console.log('Error: ' + error);
  //     }, fOptions
  //   );

  // }

  $http.get("http://smartconnection.herokuapp.com/api/customer/referenceNumbers/employee/" + id + "/date/" + dateAsString + "", {
    headers: {
      'x-access-token': storage.getItem('loginToken')
    }
  }).success(function (result) {
    $scope.regular = result.regular;
    $scope.spot = result.spot;
  }).error(function (error) {
    //$window.alert("Error");
  });
  $scope.NextClick = function () {
    if ($scope.selectedRegularAppointment != null || $scope.selectedSpotAppointment != null) {
      if ($scope.CustomerDetails != null) {
        $scope.section = {
          section2: true
        };
      }
    }
  }
  $scope.NextClick2 = function () {
    var elmn = angular.element(document.querySelector('#images'));
    elmn.empty();
    images = [];
    $scope.comments = null;
    $scope.section = {
      section3: true
    };
  }
  //Get Customer Details
  $scope.getCustomerDetails = function (selectedAppointment) {
    if (selectedAppointment != null) {
      var customerID = selectedAppointment.customerID;
      $scope.apointmentId = selectedAppointment._id;
      $http.get("http://smartconnection.herokuapp.com/api/customer/customerDetails/customer/" + customerID, {
        headers: {
          'x-access-token': storage.getItem('loginToken')
        }
      }).success(function (result) {
        $scope.CustomerDetails = result;
      }).error(function (error) {
        //$window.alert("Error");
      });
    }
  }




  // $scope.saveClosing = function () {

  //   var defs = [];

  //   //$scope.images.forEach(function(i) {
  //   for (i = 0; i < $scope.images.length; i++) {
  //     console.log('processing ' + i);
  //     var def = $.Deferred();

  //     function win(r) {
  //       console.log("thing done");
  //       if ($.trim(r.response) === "0") {
  //         console.log("this one failed");
  //         def.resolve(0);
  //       } else {
  //         console.log("this one passed");
  //         console.log(r.response);
  //         def.resolve(1);
  //       }
  //     }

  //     function fail(error) {
  //       console.log("upload error source " + error.source);
  //       console.log("upload error target " + error.target);
  //       def.resolve(0);
  //     }

  //     var uri = encodeURI("http://smartconnection.herokuapp.com/api/serviceprovider/closingAttachmentUploads");

  //     var options = new FileUploadOptions();
  //     options.fileKey = "file";
  //     options.fileName = $scope.images[i].substr($scope.images[i].lastIndexOf('/') + 1);
  //     options.mimeType = "image/jpeg";

  //     data = {
  //       "empId": $rootScope.user.id,
  //       "appointmentId": $scope.apointmentId
  //     }

  //     var headers = { 'x-access-token': storage.getItem('loginToken') };
  //     options.headers = headers;
  //     options.params = data;

  //     var ft = new FileTransfer();
  //     ft.upload($scope.images[i], uri, win, fail, options);
  //     defs.push(def.promise());

  //   };

  //   $.when.apply($, defs).then(function () {
  //     console.log("all things done");
  //     var data = {
  //       "employeeId": $rootScope.user.id,
  //       "appointmentId": $scope.apointmentId,
  //       "comments": $scope.comments
  //     };
  //     $http.post("http://smartconnection.herokuapp.com/api/serviceProvider/closeAppointment/", data, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'x-access-token': storage.getItem('loginToken')
  //       }
  //     }).success(function (result) {
  //       if (result.success == true) {
  //         $mdDialog.show(
  //           $mdDialog.alert()
  //             .parent(angular.element(document.querySelector('#popupContainer')))
  //             .clickOutsideToClose(true)
  //             .textContent(result.message)
  //             .ariaLabel('Alert Dialog Demo')
  //             .ok('OK')
  //         );
  //          $scope.images = null;
  //         $location.path('/home');
  //       }
  //       console.log(result);
  //     }).error(function (error) {

  //     });
  //   });

  // }


}]);