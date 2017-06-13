var smartApp = angular.module('smartApp', ['ui.router', 'ngMaterial', 'ngCordova', 'textAngular']);
smartApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
        .state('common', {
            templateUrl: 'templates/common.html',
            abstract: true,
            controller: 'baseCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
        })
        .state('home', {
            url: '/home',
            parent: 'common',
            templateUrl: 'templates/home.html',
            controller: 'homeCtrl'
        })
        .state('appointmentStatus', {
            url: '/appointmentStatus',
            parent: 'common',
            templateUrl: 'templates/appointmentStatus.html',
            controller: 'appointmentStatusCtrl'
        })
        .state('search', {
            url: '/search',
            parent: 'common',
            templateUrl: 'templates/search.html',
            controller: 'searchCtrl.js'
        })
        .state('pendingList', {
            url: '/pendingList',
            parent: 'common',
            templateUrl: 'templates/pendingList.html',
            controller: 'pendingListCtrl'
        })
        .state('upcomingAppointmentList', {
            url: '/upcomingAppointmentList',
            parent: 'common',
            templateUrl: 'templates/upcomingAppointmentList.html',
            controller: 'upcomingAppointmentListCtrl'
        })
        .state('searchSP', {
            url: '/searchSP',
            parent: 'common',
            params: {
                appRefNo: null,
                serviceProviderID: null
            },
            templateUrl: 'templates/searchSP.html',
            controller: 'searchSPCtrl'
        })
        .state('upcomingAppointment', {
            url: '/upcomingAppointment',
            parent: 'common',
            templateUrl: 'templates/upcomingAppointment.html',
            controller: 'upcomingAppointmentCtrl'
        })
        .state('employeesAppointment', {
            url: '/employeesAppointment',
            parent: 'common',
            templateUrl: 'templates/employeesAppointment.html',
            controller: 'employeesAppointmentCtrl'
        })
        .state('todaysAppointment', {
            url: '/todaysAppointment',
            parent: 'common',
            templateUrl: 'templates/todaysAppointment.html',
            controller: 'todaysAppointmentCtrl'
        })
        .state('previousAppointment', {
            url: '/previousAppointment',
            parent: 'common',
            templateUrl: 'templates/previousAppointment.html',
            controller: 'previousAppointmentCtrl'
        })
        .state('otpVerification', {
            url: '/otpVerification',
            templateUrl: 'templates/otpVerification.html',
            controller: 'otpVerificationCtrl'
        })
        .state('forgotPassword', {
            url: '/forgotPassword',
            templateUrl: 'templates/forgotPassword.html',
            controller: 'forgotPasswordCtrl'
        })
        .state('resetPassword', {
            url: '/resetPassword',
            templateUrl: 'templates/resetPassword.html',
            controller: 'resetPasswordCtrl'
        })
        .state('customerScheduler', {
            url: '/customerScheduler',
            parent: 'common',
            templateUrl: 'templates/customerScheduler.html',
            controller: 'customerSchedulerCtrl'
        })
        .state('customerProfile', {
            url: '/customerProfile',
            parent: 'common',
            templateUrl: 'templates/customerProfile.html',
            controller: 'customerProfileCtrl'
        })
        .state('closing', {
            url: '/closing',
            parent: 'common',
            // params: {
            //     selectedAppointment: null
            // },
            templateUrl: 'templates/closing.html',
            controller: 'closingCtrl'
        })

        .state('appointmentScheduleCustomer', {
            url: '/appointmentScheduleCustomer',
            parent: 'common',
            templateUrl: 'templates/appointmentScheduleCustomer.html',
            controller: 'appointmentScheduleCustomerCtrl'
        })
        .state('registration', {
            url: '/registration',
            templateUrl: 'templates/registration.html',
            controller: 'registrationCtrl'
        });
    // $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';

    //  delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //  $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    //  $httpProvider.defaults.headers.get = {};
    //  $httpProvider.defaults.headers.common = {};
    //  $httpProvider.defaults.headers.post = {};
    //  $httpProvider.defaults.headers.put = {};
    //  $httpProvider.defaults.headers.patch = {};
    //$httpProvider.defaults.headers("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, x-access-token, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    // var accessToken = window.localStorage.getItem("loginToken");
    // if (accessToken && accessToken .length > 0) {
    //     $urlRouterProvider.otherwise('/home');
    // }
    // else{

    // }
    //alert(window.localStorage.getItem("loginToken"))
    //if(!window.localStorage.getItem("loginToken")) {
    $urlRouterProvider.otherwise('/login');
    //}
}).constant("CONFIG", {
    "API_URL": "http://smartconnection.herokuapp.com/"
});