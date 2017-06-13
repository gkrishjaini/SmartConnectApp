smartApp.controller('forgotPasswordCtrl', function($scope, $window, $http, $state, $mdDialog, $rootScope) {
    $scope.CircularLoader = true;
     $scope.forgotPasswordClick = function()
     {   
        var userName = $scope.userName;
        $scope.CircularLoader = false;
        $rootScope.username = $scope.userName;
        $http.post('http://smartconnection.herokuapp.com/api/passwordReset/OTP/'+userName+'/send', {
             headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
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
                    $state.go('otpVerification');
                }
            }).error(function(error) {
                $scope.CircularLoader = true;
               //alert("Error");
            });    
    }
});


