smartApp.controller('todaysAppointmentCtrl', function ($scope, $window, $http, $location, $filter) {
  var id = storage.getItem('userId');
  var date = new Date();
  var dateAsString = $filter('date')(date, "yyyy-MM-dd");
  //var date_utc = date.toISOString();
  $http.get("http://smartconnection.herokuapp.com/api/customer/scheduleAppointment/Appointments/" + id + "/" + dateAsString, {
    headers: {
      'x-access-token': storage.getItem('loginToken')
    }
  }).success(function (result) {
    $scope.todayAppointmentList = result;
  }).error(function (error) {
    //$window.alert("Error");
  });
//   document.addEventListener("deviceready", onDeviceReady, false);
 
// function onDeviceReady() {
//     //navigator.splashscreen.hide();
//     document.addEventListener("backbutton", onBackButton, false);
// }
 
// function onBackButton(e) {
//      e.preventDefault();
//      navigator.app.backHistory();
// }
//   document.addEventListener("deviceready", function() {
//   document.addEventListener("backbutton", onBackKeyDown, false);

//   function onBackKeyDown() {
//       navigator.app.backHistory();
//   }
// }, false);
});