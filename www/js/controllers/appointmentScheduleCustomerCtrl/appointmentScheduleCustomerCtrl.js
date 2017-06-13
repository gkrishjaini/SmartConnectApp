smartApp.controller('appointmentScheduleCustomerCtrl', function ($scope, $window, $http, $location, $rootScope, $filter, SearchService, $mdDialog) {
  var date = new Date();
  $scope.dateAsString = $filter('date')(date, "yyyy-MM-dd");
  $scope.showHints = true;
  $scope.CircularLoader = true;
  $scope.section = {
    section1: true
  };
  $scope.answer = [];
  $scope.search = function () {
    $scope.customer = null;
    if ($scope.businessArea || $scope.customerName || $scope.zipCode || $scope.contactNumber) {
      $scope.CircularLoader = false;
      var data = {
        "data": {
          "firstName": $scope.customerName,
          "mobilePhone": $scope.contactNumber,
          "zipCode": $scope.zipCode,
          "areaCode": $scope.businessArea
        },
        "type": "Customers"
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
              .textContent('No Customer found')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
          );
          //alert("No Service provider found");
        } else {
          $scope.searchCustomer = result;
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
  $scope.getAppointmentType = function (customer) {
    var id = customer._id;
    $scope.customer = customer;

    // AppointmentOptions: Contact, Default, Regular
    $scope.customer_id = customer._id;
    $scope.customersName = customer.firstName;
    //$scope.appointmentOption = customer.appointmentOption;
    // $scope.defaultAppointmentId = customer.appointmentId;

    $scope.selectedCSItem = id;
    $scope.customerList = id;
    //var selectedSp = $scope.serviceProvidersList;

    // $scope.selectedSp = ($filter('filter')($scope.searchServiceProvider, {
    //   _id: $scope.serviceProvidersList
    // }))[0];

    var data = {
      "data": {
        "serviceProviderId": $rootScope.user.id
      },
      "method": "type"
    };
    $http.post("http://smartconnection.herokuapp.com/api/serviceprovider/appointments/", data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': storage.getItem('loginToken')
      }
    }).success(function (result) {
      console.log(result);
      $scope.listAppointmentType = result;
      if (result.status == 'Default') {
        $scope.defaultAppointmentId = $scope.listAppointmentType.details.appointmentId;
      }
    }).error(function (error) {
      console.log(error);
      //$window.alert("Error");
    });
  }
  $scope.step2 = function () {

    // if ($scope.appointmentOption == 'Contact') {
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
    if ($rootScope.serviceProviderAppointmentOption == 'Regular') {
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
    else if ($rootScope.serviceProviderAppointmentOption == 'Default') { // Appointment Option Default
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
        $scope.selectedAppointmentName = result[0].appointmentName;
         $scope.questionList = result[0].questions;
        // max date and min date for date picker
        // $scope.AppointmentMaxDate = new Date(result[0].effectiveTo);
        $scope.AppointmentMinDate = new Date(result[0].effectiveFrom) > new Date() ? new Date(result[0].effectiveFrom) : new Date();

      }).error(function (error) {
        // $window.alert("Error");
        $scope.CircularLoader = true;
      });
    }

    $scope.getAppointmentCategory = function () {
      $scope.CircularLoader = false;
      var data = {
        "data": {
          "serviceProviderId": $rootScope.user.id,
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
          "serviceProviderId": $rootScope.user.id,
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
          "serviceProviderId": $rootScope.user.id,
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
          "serviceProviderId": $rootScope.user.id,
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

    //   $scope.knowledgeBaseNext = function () {
    //     $scope.section = { section4: true };
    //   }
    $scope.getQuestions = function () {

      $scope.section = { section4: true };
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
        $scope.spotFlag = result[0].spot;
        $scope.questionList = result[0].questions;
        $scope.employeesList = result[0].employees;
        $scope.timeFormat = result[0].timeFormat;
        $scope.appointmentName = result[0].appointmentName;
        //$scope.knowledgeBase = result[0].knowledgeBase;


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
      $scope.spotSelected = null;
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
    $scope.spotClicked = function () {
      if ($scope.spotSelected) {
        if ($scope.selectedEmployee == null) {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .textContent('Please Select Employee')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
          );
        }
        else {
          //last appointment details api
          $http.get("http://smartconnection.herokuapp.com/api/customer/scheduleAppointment/last/empId/" + $scope.selectedEmployee + "/apId/" + $scope.AppointmentID._id + "/" + $scope.dateAsString + "", {
            headers: {
              'x-access-token': storage.getItem('loginToken')
            }
          }).success(function (result) {
            $scope.lastAppointmentDate = result[0];

          }).error(function (error) {

          });

          // $scope.selectedEmployee = null;
          $scope.appointmentSlotes = null;
          $scope.spot = true;
        }
      }
      else {
        $scope.spot = false;
        $scope.appointmentSlotes = null;
      }

    }
    $scope.ampmClicked = function () {
      $scope.ampm = $scope.ampm == 'am' ? 'pm' : 'am'
      // $scope.customTime = $scope.customTime + $scope.ampm
    }
    $scope.getAppointment = function () {
      var userId = $scope.customer_id;
      if ($rootScope.serviceProviderAppointmentOption == 'Default') {
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

        if (id, date) {
          $scope.CircularLoader = false;
          SearchService.getScheduleAppointment(date, id._id, empId, userId)
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
        if ($scope.customTime || $scope.selectedSlote){
          if ($scope.spot) {
            if ($scope.lastAppointmentDate) {
              format = $scope.timeFormat == '12' ? 'hh:mm a' : 'HH:mm';
              var prevTime = moment($scope.lastAppointmentDate.appointmentTime, format);
              var newTime = moment($scope.customTime, format);

              var diftime = newTime.diff(prevTime);

              if (diftime < 0) {
                // toaster.pop('info', "Invalid Time", 'Time should be grather than previous Time');
                // return;
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .textContent('Time should be grather than previous Time')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                );
              }
              else {
                $scope.section = { section7: true };
              }
            }
            else {
              $scope.section = { section7: true };
            }
          }
          else {
            $scope.section = { section7: true };
          }
        }
        else{
           $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .textContent('Fields Empty')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                );
        }
      },
      saveAppointment: function () {
        if ($scope.spotSelected) {
          var data = {
            "answers": $scope.answer,
            "apointmentId": $scope.AppointmentID._id,
            "appointmentDate": moment($scope.dateAsString).format('YYYY-MM-DD'),
            "appointmentName": $scope.appointmentName,
            "appointmentTime": $scope.customTime + " " + $scope.ampm,
            "customerID": $scope.customer_id,
            "customerName": $scope.customersName,
            "employeeId": $scope.selectedEmployee,
            "serviceProviderId": $rootScope.user.id,
            "spot": true,
            "type": "Service_Provider",
            "spuniqueId": $scope.user.uniqueid,
            "displayappointmentId": $scope.questionDetails[0].appointmentId,
            "updation": false,
            "anyEmp": false
          };
        }
        else if ($rootScope.serviceProviderAppointmentOption == 'Default') {
          var data = {
            "answers": $scope.answer,
            "apointmentId": $scope.defaultAppointmentId,
            "appointmentDate": moment($scope.AppointmentDate).format('YYYY-MM-DD'),
            "appointmentName": $scope.selectedAppointmentName,
            "appointmentTime": $scope.selectedSlote.time,
            "customerID": $scope.customer_id,
            "customerName": $scope.customersName,
            "employeeId": $scope.selectedEmployee,
            "serviceProviderId": $rootScope.user.id,
            "spot": false,
            "type": "Service_Provider",
            "spuniqueId": $scope.user.uniqueid,
            "displayappointmentId": $scope.questionDetails[0].appointmentId,
            "updation": false,
            "anyEmp": $scope.anyEmployee
          };
        }
        else {
          var data = {
            "answers": $scope.answer,
            "apointmentId": $scope.AppointmentID._id,
            "appointmentDate": moment($scope.AppointmentDate).format('YYYY-MM-DD'),
            "appointmentName": $scope.selectedAppointmentName,
            "appointmentTime": $scope.selectedSlote.time,
            "customerID": $scope.customer_id,
            "customerName": $scope.customersName,
            "employeeId": $scope.selectedEmployee,
            "serviceProviderId": $rootScope.user.id,
            "spot": false,
            "type": "Service_Provider",
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
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.querySelector('#popupContainer')))
                  .clickOutsideToClose(true)
                  .title('Confirmation')
                  .textContent('Appointment created and sent for approval. Confirmation Number:  ' + result.data.confirmationNumber + '  Sequence Number: ' + result.data.sequenceNumber)
                  .ariaLabel('Alert Dialog Demo')
                  .ok('OK')
              );
              // alert("Appointment created and sent for approval.");
              $location.path('/home');
            } else {
              alert(result.data.message);
            }
          }, function (error) {
            $scope.CircularLoader = true;
            // alert('Error!');
          });

      }
    };
  }
});