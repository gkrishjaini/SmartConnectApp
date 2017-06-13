//var smartApp = angular.module('smartApp')
var loginToken;
var userId;
//$rootScope.tokenValue = 0;
var storage = window.localStorage;
document.addEventListener("deviceready", function () {
    FCMPlugin.onNotification(
        function (data) {
            if (data.wasTapped) {
                //Notification was received on device tray and tapped by the user. 
                alert(JSON.stringify(data));
            } else {
                //Notification was received in foreground. Maybe the user needs to be notified. 
                //alert(JSON.stringify(data.Message));
                navigator.notification.alert(
                    JSON.stringify(data.Message),  // message
                    alertDismissed,         // callback
                    'Appointment Update',            // title
                    'OK'                  // buttonName
                );

            }
        },
        function (msg) {
            console.log('onNotification callback successfully registered: ' + msg);
        },
        function (err) {
            console.log('Error registering onNotification callback: ' + err);
        }
    );

    function alertDismissed() {
    // do something
    }
});

smartApp.controller('loginCtrl', function ($scope, $window, $http, $location, $rootScope, $mdDialog, $cordovaDevice) {
    $scope.CircularLoader = true;
    $scope.login = function () {
        if ($scope.form.$valid) {
            //$scope.Type = "Customer"   
            //$window.alert("selected Type " + $scope.Type);
            $scope.CircularLoader = false;
            document.addEventListener("deviceready", function () {




                FCMPlugin.getToken(
                    function (token) {
                        $scope.deviceToken = token;
                        $scope.platform = $cordovaDevice.getPlatform();
                        $scope.uuid = $cordovaDevice.getUUID();
                        $scope.device = "true";
                        console.log(token)
                        var data = "userName=" + $scope.email + "&password=" + $scope.password + "&device=" + $scope.device + "&deviceId=" + $scope.uuid + "&platform=" + $scope.platform + "&token=" + $scope.deviceToken;
                        $http.post("http://smartconnection.herokuapp.com/api/authenticate", data, {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).success(function (result) {
                            $scope.value = result.success;
                            if ($scope.value == true) {
                                // $rootScope.tokenValue = result.token
                                storage.setItem('loginToken', result.token)
                                $rootScope.token = result.token

                                //var value = storage.getItem(loginToken);
                                //$window.alert("success");
                                $http.get('http://smartconnection.herokuapp.com/api/me', {
                                    headers: {
                                        'x-access-token': storage.getItem('loginToken')
                                    }
                                }).success(function (response) {
                                    $scope.CircularLoader = true;
                                    // console.log(response.type)
                                    $rootScope.serviceProviderAppointmentOption = response.appointmentOption;
                                    $rootScope.user = response;
                                    storage.setItem('userId', response.id)
                                    $location.path('/home');
                                }).error(function (error) {
                                    $scope.CircularLoader = true;
                                    //window.alert(error)
                                });
                            }
                            else {
                                $scope.CircularLoader = true;
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .parent(angular.element(document.querySelector('#popupContainer')))
                                        .clickOutsideToClose(true)
                                        .textContent('Invalid login attempt.')
                                        .ariaLabel('Alert Dialog Demo')
                                        .ok('OK')
                                );
                                //$window.alert("Invalid login attempt.");
                            }

                        }).error(function (error) {
                            $scope.CircularLoader = true;
                            //$window.alert("Error");
                        });
                    },
                    function (err) {
                        console.log('error retrieving token: ' + err);
                    }
                )

            }, false);

        }
    }
});

