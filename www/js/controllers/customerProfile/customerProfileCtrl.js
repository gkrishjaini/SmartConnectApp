smartApp.controller('customerProfileCtrl', function($scope, $window, $http, $location) {
    var CustomerId = storage.getItem('userId')
    $http.get('http://smartconnection.herokuapp.com/api/customer/'+CustomerId, {
         headers: {
             'x-access-token': storage.getItem('loginToken')
                 }
         }).success(function(response){
             $scope.customerProfile = response
              //console.log(response.firstName)
             // $rootScope.user = response;
              // $location.path('/home');
         }).error(function(error){
                        //window.alert(error)
     });
});
