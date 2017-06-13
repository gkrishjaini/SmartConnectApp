smartApp.controller('searchSPCtrl', function ($scope, $window, $http, $location, $rootScope, $filter, $sce, SearchService, $mdDialog, $state, $stateParams) {
  $scope.CircularLoader = true;

  // functionality to Edit Appointment
  var appRefNo = $state.params.appRefNo;
  var serviceProviderID = $state.params.serviceProviderID;
  if (appRefNo, serviceProviderID) {
    var userId = $rootScope.user.id;
    $http.get("http://smartconnection.herokuapp.com/api/customer/getscheduledAppointment/refNo/" + appRefNo + "/spId/" + serviceProviderID, {
      headers: {
        'x-access-token': storage.getItem('loginToken')
      }
    }).success(function (result) {
      console.log(result);
      $scope._id = result._id;
      $scope.selectedEmployee = result.employeeId;
      $scope.appointmentDate = result.appointmentDate;
      $scope.serviceProviderID = result.serviceProviderID;
      $scope.AppointmentID = result.apointmentId;
      $scope.AppointmentDate = result.appointmentDate;
      $scope.selectedEmployee = result.employeeId;
      $scope.questionList = result.answers;
      $scope.answer = result.answers;
      $scope.searchServiceProvider = result.SpDetails;

      if (result.type == "Default Appointment") {
        $scope.appointmentOption = "Default";
        $scope.getAppointment();
      }
      else {
        $scope.appointmentOption = "Regular";
        $scope.employeesList = result.Employees;
        $scope.getAppointment();
        $scope.selectedAppointmentType = result.selectedType;
        $scope.selectedAppointmentCategory = result.selectedCategory;
        $scope.selectedAppointmentSubCategory = result.selectedSubCategory;
        $scope.selectedAppointmentName = result.appointmentName;
        $scope.listAppointmentType = result.Types;
        $scope.listAppointmentCategory = result.Categories;
        $scope.listAppointmentSubCategory = result.SubCategories;
        $scope.listAppointmentName = result.AppointmentCollection;
        $scope.knowledgeBase = result.KnowledgeBase;
      }
      $scope.section = {
        section5: true
      };
    }).error(function (error) {
    });
  }
  else {
    $scope.section = {
      section1: true
    };
  }

  $scope.answer = [];
  $scope.search = function () {
    $scope.serviceProvider = null;
    $scope.selectedSPItem = null;
    if ($scope.businessArea || $scope.spName || $scope.zipCode || $scope.contactNumber) {
      $scope.CircularLoader = false;
      var data = {
        "data": {
          "firstName": $scope.spName,
          "mobilePhone": $scope.contactNumber,
          "zipCode": $scope.zipCode,
          "areaCode": $scope.businessArea
        },
        "type": "ServiceProviders"
      };
      $http.post("http://smartconnection.herokuapp.com/api/serviceprovider/search/", data, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': storage.getItem('loginToken')
        }
      }).success(function (result) {
        $scope.CircularLoader = true;
        if (result.length == 0) {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Search Result')
              .textContent('No Service provider found')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
          );
          //alert("No Service provider found");
        } else {
          $scope.searchServiceProvider = result;
          // ie, if first form is valid then go to next form (div)
          $scope.section = {
            section2: true
          };

        }
      }).error(function (error) {
        $scope.CircularLoader = true;
        //$window.alert("Error");
      });
    }
    else {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Fields Empty')
          .textContent('Please enter fields to search')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
      );
      //alert("Fields Empty");
    }
  }
  $scope.getAppointmentType = function (serviceProvider) {
    var id = serviceProvider._id;
    $scope.serviceProvider = serviceProvider;

    // AppointmentOptions: Contact, Default, Regular
    $scope.sp_id = serviceProvider._id;
    $scope.appointmentOption = serviceProvider.appointmentOption;
    $scope.defaultAppointmentId = serviceProvider.appointmentId;

    console.log($scope.serviceProvidersList);
    $scope.selectedSPItem = id;
    $scope.serviceProvidersList = id;
    //var selectedSp = $scope.serviceProvidersList;

    $scope.selectedSp = ($filter('filter')($scope.searchServiceProvider, {
      _id: $scope.serviceProvidersList
    }))[0];

    var data = {
      "data": {
        "serviceProviderId": $scope.serviceProvidersList
      },
      "method": "type"
    };
    $http.post("http://smartconnection.herokuapp.com/api/serviceprovider/appointments/", data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': storage.getItem('loginToken')
      }
    }).success(function (result) {
      $scope.listAppointmentType = result;
    }).error(function (error) {
      //$window.alert("Error");
    });
  }
  $scope.step2 = function () {

    if ($scope.appointmentOption == 'Contact') {
      $scope.section = { section6: true };
      $scope.CircularLoader = false;
      var spID = $scope.serviceProvidersList;
      $http.get("http://smartconnection.herokuapp.com/api/serviceprovider/" + spID, {
        headers: {
          'x-access-token': storage.getItem('loginToken')
        }
      }).success(function (result) {
        $scope.contactDetailList = result;
        $scope.CircularLoader = true;
      }).error(function (error) {
        // $window.alert("Error");
        $scope.CircularLoader = true;
      });
    }
    else if ($scope.appointmentOption == 'Regular') {
      $scope.section = {
        section3: true
      };
      // resetting dropdowns
      $scope.selectedAppointmentType = null;
      $scope.selectedAppointmentCategory = null;
      $scope.selectedAppointmentSubCategory = null;
      $scope.selectedAppointmentName = null;
      $scope.AppointmentID = null;
    }
    else if ($scope.appointmentOption == 'Default') { // Appointment Option Default
      $scope.section = {
        section4: true
      };
      $scope.CircularLoader = false;
      $scope.AppointmentID = $scope.defaultAppointmentId;
      var id = $scope.defaultAppointmentId;
      $http.get("http://smartconnection.herokuapp.com/api/serviceprovider/appointmentDefinition/" + id, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'x-access-token': storage.getItem('loginToken')
        }
      }).success(function (result) {
        $scope.CircularLoader = true;
        $scope.questionDetails = result;
        $scope.questionList = result[0].questions;

        // max date and min date for date picker
        // $scope.AppointmentMaxDate = new Date(result[0].effectiveTo);
        $scope.AppointmentMinDate = new Date(result[0].effectiveFrom) > new Date() ? new Date(result[0].effectiveFrom) : new Date();

      }).error(function (error) {
        // $window.alert("Error");
        $scope.CircularLoader = true;
      });

    }
  }
  $scope.getAppointmentCategory = function () {
    $scope.CircularLoader = false;
    var data = {
      "data": {
        "serviceProviderId": $scope.serviceProvidersList,
        "appointmentType": $scope.selectedAppointmentType
      },
      "method": "category"
    };
    $http.post("http://smartconnection.herokuapp.com/api/serviceprovider/appointments/", data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': storage.getItem('loginToken')
      }
    }).success(function (result) {
      $scope.CircularLoader = true;
      $scope.listAppointmentCategory = result;

      //resetting dropdowns
      $scope.selectedAppointmentCategory = null;
      $scope.selectedAppointmentSubCategory = null;
      $scope.selectedAppointmentName = null;
      $scope.listAppointmentName = null;
      $scope.listAppointmentSubCategory = null;
      $scope.AppointmentID = null;

    }).error(function (error) {
      $scope.CircularLoader = true;
      //$window.alert("Error");
    });
  }

  $scope.getAppointmentSubCategory = function () {
    $scope.CircularLoader = false;
    var data = {
      "data": {
        "serviceProviderId": $scope.serviceProvidersList,
        "appointmentType": $scope.selectedAppointmentType,
        "appointmentCategory": $scope.selectedAppointmentCategory
      },
      "method": "subCategory"
    };
    $http.post("http://smartconnection.herokuapp.com/api/serviceprovider/appointments/", data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': storage.getItem('loginToken')
      }
    }).success(function (result) {
      $scope.CircularLoader = true;
      $scope.listAppointmentSubCategory = result;

      //resetting dropdowns
      $scope.selectedAppointmentSubCategory = null;
      $scope.selectedAppointmentName = null;
      $scope.listAppointmentName = null;
      $scope.AppointmentID = null;

    }).error(function (error) {
      $scope.CircularLoader = true;
      //$window.alert("Error");
    });
  }

  $scope.getAppointmentName = function () {
    $scope.CircularLoader = false;
    var data = {
      "data": {
        "serviceProviderId": $scope.serviceProvidersList,
        "appointmentType": $scope.selectedAppointmentType,
        "appointmentCategory": $scope.selectedAppointmentCategory,
        "appointmentSubCategory": $scope.selectedAppointmentSubCategory
      },
      "method": "names"
    };
    $http.post("http://smartconnection.herokuapp.com/api/serviceprovider/appointments/", data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': storage.getItem('loginToken')
      }
    }).success(function (result) {
      $scope.CircularLoader = true;
      $scope.listAppointmentName = result;

      //resetting dropdowns
      $scope.selectedAppointmentName = null;
      $scope.AppointmentID = null;

    }).error(function (error) {
      // $window.alert("Error");
      $scope.CircularLoader = true;
    });
  }

  $scope.getAppointmentId = function () {
    $scope.appointmentSlotes = null;
    $scope.CircularLoader = false;
    var data = {
      "data": {
        "serviceProviderId": $scope.serviceProvidersList,
        "appointmentType": $scope.selectedAppointmentType,
        "appointmentCategory": $scope.selectedAppointmentCategory,
        "appointmentSubCategory": $scope.selectedAppointmentSubCategory,
        "appointmentName": $scope.selectedAppointmentName
      },
      "method": "name"
    };
    $http.post("http://smartconnection.herokuapp.com/api/serviceprovider/appointments/", data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': storage.getItem('loginToken')
      }
    }).success(function (result) {
      $scope.CircularLoader = true;
      $scope.AppointmentID = result[0];

    }).error(function (error) {
      //$window.alert("Error");
      $scope.CircularLoader = true;
    });
  }

  $scope.knowledgeBaseNext = function () {
    $scope.section = { section4: true };
  }
  $scope.getQuestions = function () {

    // Set value based on conditions
    // ie, if the form is valid then go to next form (div)
    // if ($scope.selectedAppointmentType == 'Contact') {
    //   $scope.section = { section6: true };
    //   $scope.CircularLoader = false;
    //   var spID = $scope.serviceProvidersList;
    //   $http.get("http://smartconnection.herokuapp.com/api/serviceprovider/" + spID, {
    //     headers: {
    //       'x-access-token': storage.getItem('loginToken')
    //     }
    //   }).success(function (result) {
    //     $scope.contactDetailList = result;
    //     $scope.CircularLoader = true;
    //   }).error(function (error) {
    //     // $window.alert("Error");
    //     $scope.CircularLoader = true;
    //   });
    // }
    // else {
    $scope.section = { section8: true };
    $scope.CircularLoader = false;
    //var data = { "data":  {"serviceProviderId": $scope.serviceProvidersList , "appointmentType": $scope.selectedAppointmentType , "appointmentCategory": $scope.selectedAppointmentCategory, "appointmentSubCategory": $scope.selectedAppointmentSubCategory, "appointmentName": $scope.selectedAppointmentName }, "method": "name" };
    var id = $scope.AppointmentID._id;
    $http.get("http://smartconnection.herokuapp.com/api/serviceprovider/appointmentDefinition/" + id, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-access-token': storage.getItem('loginToken')
      }
    }).success(function (result) {
      $scope.CircularLoader = true;
      $scope.questionDetails = result;
      $scope.questionList = result[0].questions;
      $scope.employeesList = result[0].employees;
      $scope.knowledgeBase = result[0].knowledgeBase;
      //magical popup
      // $('.upload-data-content-over-wrapper').magnificPopup({
      //   delegate: 'a',
      //   type: 'image',
      //   closeOnContentClick: true,
      //   closeBtnInside: false,
      //   fixedContentPos: true,
      //   gallery: {
      //     enabled: false
      //   },
      //   zoom: {
      //     enabled: true,
      //     duration: 300,
      //     easing: 'ease-in-out',
      //     opener: function (openerElement) {
      //       return openerElement.is('div') ? openerElement : openerElement.find('div');
      //     }
      //   }
      // });

      // max date and min date for date picker
      $scope.AppointmentMaxDate = new Date(result[0].effectiveTo);
      $scope.AppointmentMinDate = new Date(result[0].effectiveFrom) > new Date() ? new Date(result[0].effectiveFrom) : new Date();

    }).error(function (error) {
      // $window.alert("Error");
      $scope.CircularLoader = true;
    });

  }

  var answer = [];
  $scope.step4 = function () {

    var questionAnswerList = $scope.answer;
    // Set value based on conditions
    // ie, if the form is valid then go to next form (div)

    $scope.section = {
      section5: true
    };

  }

  $scope.getEmployeeID = function () {
    $scope.appointmentSlotes = null;
  }

  $scope.AnyEmployeeClicked = function () {
    if ($scope.AnyEmployeeSelected) {
      $scope.selectedEmployee = null;
      $scope.appointmentSlotes = null;
      $scope.anyEmployee = true;
    }
    else {
      $scope.anyEmployee = false;
      $scope.appointmentSlotes = null;
    }
  }

  $scope.getAppointment = function () {
    var userId = storage.getItem('userId');
    if ($scope.appointmentOption == 'Default') {
      var id = $scope.AppointmentID;
      var date = $scope.AppointmentDate;
      var empId = $scope.selectedEmployee;
      if (id, date) {
        $scope.CircularLoader = false;
        SearchService.getScheduleAppointment(date, id, empId, userId)
          .then(function (result) {
            $scope.CircularLoader = true;
            $scope.schedules = result.data[0];
            $scope.appointmentSlotes = result.data;

          }, function (error) {
            $scope.CircularLoader = true;
            // alert("Error!");
          });
      }
    }
    if ($scope.AnyEmployeeSelected || $scope.selectedEmployee) {
      $scope.selectedSlote = null;
      var id = $scope.AppointmentID;
      var date = $scope.AppointmentDate;
      var empId = $scope.selectedEmployee;

      if (typeof id === 'object') {
        id = id._id;
      }

      if (id, date) {
        $scope.CircularLoader = false;
        SearchService.getScheduleAppointment(date, id, empId, userId)
          .then(function (result) {
            $scope.CircularLoader = true;
            $scope.schedules = result.data[0];
            $scope.appointmentSlotes = result.data;

          }, function (error) {
            $scope.CircularLoader = true;
            // alert("Error!");
          });
      }
    }
  }

  $scope.control = {
    next: function () {
      $scope.selectedSlote = null;
      $scope.AppointmentDate = moment($scope.AppointmentDate).add(1, 'd').toDate();
      $scope.getAppointment();
    },
    prev: function () {
      $scope.selectedSlote = null;
      $scope.AppointmentDate = moment($scope.AppointmentDate).add(-1, 'd').toDate();
      $scope.getAppointment();
    },
    selectSlote: function (slote, selectedDate) {
      if (slote.available && typeof slote.late == "undefined") {
        $scope.selectedSlote = slote;
        $scope.AppointmentDate = selectedDate;
      }
      else {
        $scope.selectedSlote = null;
      }
    },
    showConfirmation: function () {
      $scope.section = { section7: true };
    },
    saveAppointment: function () {

      if ($scope.appointmentOption == 'Default') {
        appointmentId = $scope.AppointmentID;
        empId = $scope.serviceProvidersList;
      } else {
        empId = $scope.selectedEmployee;
        appointmentId = $scope.AppointmentID._id;
      }
      if (appRefNo) {
        var data = {
          "answers": $scope.answer,
          "apointmentId": $scope.AppointmentID,
          "appointmentDate": moment($scope.AppointmentDate).format('YYYY-MM-DD'),
          "appointmentName": $scope.selectedAppointmentName,
          "appointmentTime": $scope.selectedSlote.time,
          "customerID": $rootScope.user.id,
          "customerName": $rootScope.user.name,
          "employeeId": empId,
          "serviceProviderId": $scope.serviceProviderID,
          "spot": false,
          "type": "Customer",
          "spuniqueId": $scope.user.uniqueid,
          "updation": true,
          "anyEmp": $scope.anyEmployee,
          "existingId": $scope._id
        };
      }
      else {
        var data = {
          "answers": $scope.answer,
          "apointmentId": appointmentId,
          "appointmentDate": moment($scope.AppointmentDate).format('YYYY-MM-DD'),
          "appointmentName": $scope.selectedAppointmentName,
          "appointmentTime": $scope.selectedSlote.time,
          "customerID": $rootScope.user.id,
          "customerName": $rootScope.user.name,
          "employeeId": empId,
          "serviceProviderId": $scope.serviceProvidersList,
          "spot": false,
          "type": "Customer",
          "spuniqueId": $scope.user.uniqueid,
          "displayappointmentId": $scope.questionDetails[0].appointmentId,
          "updation": false,
          "anyEmp": $scope.anyEmployee
        };

      }

      $scope.CircularLoader = false;
      SearchService.scheduleAppointment(data)
        .then(function (result) {
          $scope.CircularLoader = true;
          if (result.data.success) {
            if (appRefNo, serviceProviderID) {
               $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.querySelector('#popupContainer')))
                  .clickOutsideToClose(true)
                  .textContent(result.data.message)
                  .ariaLabel('Alert Dialog Demo')
                  .ok('OK')
              );
            }
            else {
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.querySelector('#popupContainer')))
                  .clickOutsideToClose(true)
                  .title('Confirmation')
                  .textContent('Appointment created and sent for approval. Confirmation Number:  ' + result.data.confirmationNumber + '  Sequence Number: ' + result.data.sequenceNumber)
                  .ariaLabel('Alert Dialog Demo')
                  .ok('OK')
              );
            }
            // alert("Appointment created and sent for approval.");
            $location.path('/upcomingAppointment');
          } else {
            alert(result.data.message);
          }
        }, function (error) {
          $scope.CircularLoader = true;
          // alert('Error!');
        });

    }
  };

})
  .directive('starRating', function () {
    return {
      restrict: 'A',
      template: '<ul class="rating">'
      + '	<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
      + '\u2605'
      + '</li>'
      + '</ul>',
      scope: {
        ratingValue: '=',
        max: '=',
        onRatingSelected: '&',
        ratingDisabled: '='
      },
      link: function (scope, elem, attrs) {
        var updateStars = function () {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };

        scope.toggle = function (index) {
          if (!scope.ratingDisabled) {
            scope.ratingValue = index + 1;
            scope.onRatingSelected({
              rating: index + 1
            });
          }
        };

        scope.$watch('ratingValue',
          function (oldVal, newVal) {
            if (newVal || newVal == null) {
              updateStars();
            }
          }
        );
      }
    };
  }
  );