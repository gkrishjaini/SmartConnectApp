smartApp.controller('otpVerificationCtrl', function ($scope, $window, $http, $state, $mdDialog, $rootScope) {
    $scope.CircularLoader = true;
    $scope.verifyOTP = function () {
        var otp = $scope.otp;
        var userName = $rootScope.username;
        $scope.CircularLoader = false;
        $http.post('http://smartconnection.herokuapp.com/api/passwordReset/OTP/' + userName + '/' + otp, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (result) {
            $scope.CircularLoader = true;
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .textContent(result.message)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
            );
            if (result.success == true) {
                $state.go('resetPassword');
            }
        }).error(function (error) {
            $scope.CircularLoader = true;
            //alert("Error");
        });
    }
});


