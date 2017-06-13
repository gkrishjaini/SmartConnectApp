smartApp.controller('upcomingAppointmentCtrl', function ($scope, $window, $http, $location, $filter, $mdDialog, $state, $stateParams, $rootScope) {
    var id = storage.getItem('userId');
    var date = new Date();
    var dateAsString = $filter('date')(date, "yyyy-MM-dd");
    //var _utc = d.getFullYear()+ "-" + ("00" + (d.getMonth() + 1)).slice(-2) + "-" +("00" + d.getDate()).slice(-2)+"T"+ ("00" + d.getHours()).slice(-2) + ":" +("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)+"Z";
    // var date_utc = date.toISOString();

    $http.get("http://smartconnection.herokuapp.com/api/customer/scheduleAppointment/UpcomingAppointments/" + id + "/" + dateAsString + "", {
        headers: {
            'x-access-token': storage.getItem('loginToken')
        }
    }).success(function (result) {
        $scope.upcomingAppointmentList = result;
        // var formattedDate = moment(result.appointmentDate).format('YYYYMMDD');
        //console.log(formattedDate);
    }).error(function (error) {
        //$window.alert("Error");
    });

    //API cancel appointment
    $scope.cancelAppointment = function (id) {
        var confirm = $mdDialog.confirm()
            .title('Cancel Appointment')
            .textContent('Would you like to cancel Appointment?')
            .ariaLabel('Lucky day')
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(function () {
            var data = null;
            $http.post('http://smartconnection.herokuapp.com/api/customer/cancelAppointment/' + id, data, {
                headers: {
                    'x-access-token': storage.getItem('loginToken')
                }
            }).success(function (result) {
                if (result.success == true) {
                    $scope.OnSuccess();
                }
            }).error(function (error) {
                //alert("Error");
            });
        }, function () {

        });
    }
    $scope.OnSuccess = function () {
        $http.get("http://smartconnection.herokuapp.com/api/customer/scheduleAppointment/UpcomingAppointments/" + id + "/" + dateAsString + "", {
            headers: {
                'x-access-token': storage.getItem('loginToken')
            }
        }).success(function (result) {
            $scope.upcomingAppointmentList = result;
        }).error(function (error) {
        });
    }

    $scope.editAppointment = function (appRefNo, serviceProviderID, status) {
        //alert(window.location)
        if(status != "Cancelled" && status != "Closed" && status != "Rejected"){
        $state.go('searchSP', { "appRefNo": appRefNo, "serviceProviderID": serviceProviderID });
        }
        //      $location.path('/searchSP');

        // $location.path('/searchSP').search({AppRefNo: appRefNo});
        //$location.path('/todaysAppointment'); 
    }


});