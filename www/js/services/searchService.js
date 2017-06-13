(function () {
    'use strict';

    angular
        .module('smartApp')
        .service('SearchService', SearchService);

    SearchService.$inject = ['$http', '$location', '$q', '$filter', 'CONFIG'];

    function SearchService($http, $location, $q, $filter, CONFIG) {

        this.getScheduleAppointment = getScheduleAppointment;
        this.scheduleAppointment = scheduleAppointment;


        function getScheduleAppointment(date, appointmentId, empId, userId) {
            var deferred = $q.defer();
            var dateAsString = $filter('date')(date, "yyyy-MM-dd");
            $http.get(CONFIG.API_URL + 'api/customer/scheduleAppointment/slots/' + dateAsString + '/id/' + appointmentId + '/emp/' + empId + '/view/day/customer/' + userId, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': storage.getItem('loginToken')
                    }
                })
                .then(function (result) {
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function scheduleAppointment(data) {
            var deferred = $q.defer();
            $http.post(CONFIG.API_URL + 'api/customer/scheduleAppointment/', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': storage.getItem('loginToken')
                }
            }).then(function (result) {
                deferred.resolve(result);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    }
})();