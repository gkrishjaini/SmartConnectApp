smartApp.controller('appointmentStatusCtrl', function($scope, $window, $http, $location,$rootScope) {
   $scope.getTodaysAppointment = function(){
       $location.path('/todaysAppointment');
   }
   $scope.getUpcomingAppointment = function() {

      $location.path('/upcomingAppointment');
  }  
  $scope.getPreviousAppointment = function(){
      $location.path('/previousAppointment');
  }
});


