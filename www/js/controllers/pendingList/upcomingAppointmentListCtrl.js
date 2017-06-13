smartApp.controller('upcomingAppointmentListCtrl', function($scope, $window, $http, $location, $rootScope, $mdDialog) {
    var id = storage.getItem('userId');
    var token = storage.getItem('loginToken');
    
        $http.get("http://smartconnection.herokuapp.com/api/customer/scheduleAppointment/" + id + "", {
            headers: {
                'x-access-token': storage.getItem('loginToken')
            }
        }).success(function(result) {
            $scope.upcomingAppointmentList = result;
        }).error(function(error) {
        });
    

    $scope.Approve = function(sp_id) {
        var data = null;
        $http.post("http://smartconnection.herokuapp.com/api/customer/appointmentSheduleCheck/" + sp_id + "/update/Confirmed", data, {
            headers: {
                'x-access-token': token
            }
        }).success(function(result) {
            if (result.success == true) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .textContent("Appointment Approved")
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                );
            $scope.getAppoitnmentList();

            }
        }).error(function(error) {

        });
    }

    $scope.Reject = function(sp_id) {
        var data = null;
        $http.post("http://smartconnection.herokuapp.com/api/customer/appointmentSheduleCheck/" + sp_id + "/update/Rejected", data, {
            headers: {
                'x-access-token': token
            }
        }).success(function(result) {
            if (result.success == true) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .textContent("Appointment Rejected")
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                );
             $scope.getAppoitnmentList();
            }
        }).error(function(error) {

        });
    }

    $scope.getAppoitnmentList = function(){
         $http.get("http://smartconnection.herokuapp.com/api/customer/scheduleAppointment/" + id + "", {
            headers: {
                'x-access-token': storage.getItem('loginToken')
            }
        }).success(function(result) {
            $scope.upcomingAppointmentList = result;
        }).error(function(error) {
        });
    }
});
