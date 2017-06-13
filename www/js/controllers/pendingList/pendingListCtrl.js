smartApp.controller('pendingListCtrl', function ($scope, $window, $http, $location, $rootScope) {
    $scope.getUpcomingAppointmentList = function () {
        $location.path('/upcomingAppointmentList');
    }
    // document.addEventListener("backbutton", onBackKeyDown, false);

    // function onBackKeyDown() {
    //     navigator.app.backHistory();
    // }
});


