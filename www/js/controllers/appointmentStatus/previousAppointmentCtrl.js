smartApp.controller('previousAppointmentCtrl', function ($scope, $window, $http, $location, $filter) {
    var id = storage.getItem('userId');
    var date = new Date();
    var dateAsString = $filter('date')(date, "yyyy-MM-dd");
   //var dateAsString = '2016-10-15';
    $scope.ratingItems = {};
    //var _utc = d.getFullYear()+ "-" + ("00" + (d.getMonth() + 1)).slice(-2) + "-" +("00" + d.getDate()).slice(-2)+"T"+ ("00" + d.getHours()).slice(-2) + ":" +("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)+"Z";
    // var date_utc = date.toISOString();
    $http.get("http://smartconnection.herokuapp.com/api/customer/scheduleAppointment/previousAppointments/" + id + "/" + dateAsString + "", {
        headers: {
            'x-access-token': storage.getItem('loginToken')
        }
    }).success(function (result) {
        $scope.previousAppointmentList = result;

    }).error(function (error) {

    });
    //Star Rating
    $scope.rateFunction = function (rating, ID) { 
        var ratingValue = rating;
        var spID = ID;
        $http.get("http://smartconnection.herokuapp.com/api/serviceProvider/serviceProviderRating/" + ratingValue + "/serviceProvider/" + spID + "", {
            headers: {
                'x-access-token': storage.getItem('loginToken')
            }
        }).success(function (result) {

        }).error(function (error) {
            // $window.alert("Error");
            alert(error);
        });
    };
});

