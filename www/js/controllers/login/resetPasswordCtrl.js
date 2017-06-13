smartApp.controller('resetPasswordCtrl', function($scope, $window, $http, $state, $mdDialog, $rootScope) {
    $scope.CircularLoader = true;
     $scope.resetPassword = function()
     {  
      $scope.CircularLoader = false;  
      if($scope.newPassword == $scope.confirmPassword) {
        var userName = $rootScope.username;
        var data = {
                     "userName" : $rootScope.username,
                     "phase" : "changePasswordbyOTP",
                     "password" : $scope.newPassword
                    };
        $http.post("http://smartconnection.herokuapp.com/api/passwordReset", data, {
             headers: {
                    'Content-Type': 'application/json'
             }
            }).success(function(result) {
                $scope.CircularLoader = true;
                $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .textContent(result.message)
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                );
                if(result.success == true){
                    $state.go('login');
                }
            }).error(function(error) {
                $scope.CircularLoader = true;
               //alert("Error");
            });    
     }
      else{
          $scope.CircularLoader = true;
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
    
});
