smartApp.controller('employeesAppointmentCtrl', function($scope, $window, $http, $location, $filter, $mdDialog, $state, $stateParams) {

    var id = storage.getItem('userId');
    var date = new Date();
    var dateAsString = $filter('date')(date, "yyyy-MM-dd");

    var data = {
        "empId": id,
        "date": dateAsString
    };
    $http.post("http://smartconnection.herokuapp.com/api/customer/scheduleAppointment/appointmentReport", data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': storage.getItem('loginToken')
        }
    }).success(function(result) {
        $scope.appointmentReportList = result.entity;
    }).error(function(error) {

    });

    // $scope.closing = function(selectedAppointment) {
    //     $state.go('closing', { "selectedAppointment": selectedAppointment });
    // };

    $scope.view = function(items) {
        $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            template:
            '<md-dialog flex="90">' +
            ' <md-toolbar> ' +
            '<div class="list-group-item active"> ' +
            '<h2>Requirements</h2> ' +
            '</div>' +
            '</md-toolbar>' +
            ' <md-dialog-content> ' +
            '<div class="list-group list-group-sm" aria-hidden="false" ><br>' +
            ' <ul ng-repeat="item in items">' +
            ' <li> {{item.question}} <br> {{item.answer}}</li>' +
            ' </ul>' +
            ' </div>' +
            '</md-dialog-content> ' +
            '</md-dialog>',
            controller: function DialogController($scope, $mdDialog) {
                $scope.closeDialog = function() {
                    $mdDialog.hide();
                }
                $scope.items = items;
            }
        });
    };
});

