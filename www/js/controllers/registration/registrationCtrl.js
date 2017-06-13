//var smartApp = angular.module('smartApp', [])

smartApp.controller('registrationCtrl', function ($scope, $window, $http, $state, $mdDialog) {

  //Api to list country name
 $http.get("http://smartconnection.herokuapp.com/api/regularLookups/Country", {
    }).success(function (result) {
        console.log(result);
        $scope.countries = _.pluck(result, 'value');
       // console.log($scope.countries);
    }).error(function (error) {
        //$window.alert("Error");
    });


  $scope.customerRegister = function () {
    if ($scope.form.$valid) {
      if ($scope.password == $scope.confirmpassword) {
        //  $window.alert("valid data");
        var data = {
          "firstName": $scope.firstName,
          "lastName": $scope.lastName,
          "userName": $scope.userName,
          "password": $scope.password,
          "gender": $scope.gender,
          "areaCode": $scope.areaCode,
          "mobilePhone": $scope.mobilePhone,
          "email": $scope.userName,
          "country": $scope.country,
          "zipCode": $scope.zipCode,
          "termsAndConditions": $scope.terms
        };

        //$http({ url: "http://smartconnection.herokuapp.com/api/customer", data: data})
        $http.post("http://smartconnection.herokuapp.com/api/customer", data)
          .then(function (result) {
            if(result.data.success == true){
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Registered successfully')
                .textContent('Mail sent for approval')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
            );
            // alert("Registered successfully and mail is sent for approval");
            $state.go('login');
            }
            else{
              $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .textContent(result.data.message)
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
            );
            }
            //$location.path('/login');
          }, function (error) {
            console.log(error);
            // $window.alert("Error");
          });
      }
      else {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .textContent("Passwords don't match")
            .ariaLabel('Alert Dialog Demo')
            .ok('OK')
        );
      }
    }
  }
});