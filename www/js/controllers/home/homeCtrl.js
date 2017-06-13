smartApp.controller('homeCtrl', function ($scope, $window, $location) {
    // $scope.login = function()
    // {   
    //     $scope.Type = "Admin"   
    //     //$window.alert("selected Type " + $scope.Type);
    //     var data = "userName="+$scope.email+"&password=" + $scope.password+ "&Type="+$scope.Type;
    //     $http.post("http://smartconnection.herokuapp.com/api/authenticate", data, {
    //          headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded'
    //          }
    //         }).success(function(result) {
    //             $window.alert(result.success);
    //         }).error(function(error) {
    //            $window.alert("Error");
    //         });
    // }
    // document.addEventListener("backbutton", onBackKeyDown, false);

    // function onBackKeyDown() {
    //         navigator.app.backHistory();
    // }

    document.addEventListener("deviceready", onDeviceReady, false);
 
function onDeviceReady() {
    //navigator.splashscreen.hide();
    document.addEventListener("backbutton", onBackButton, false);
}
 
function onBackButton(e) {
    console.log($location.hash);
    if(location.hash == "#/home"){
        e.preventDefault();
        navigator.app.exitApp();
    }
    else{
        e.preventDefault();
        navigator.app.backHistory();
    }
}
});


