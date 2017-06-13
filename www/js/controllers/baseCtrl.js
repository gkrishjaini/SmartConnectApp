smartApp.controller('baseCtrl', function ($scope, $location, $window) {
    $scope.logout = function () {
        $window.localStorage.removeItem("loginToken");
        $window.localStorage.clear();
        $location.path('#/login');
        window.onpopstate = function (e) { 
            window.history.forward(1); 
        }
    }
});


