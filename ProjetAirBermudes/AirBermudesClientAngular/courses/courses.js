angular.module('AppAirBermudes.courses', ['ngRoute'])
.controller('CourseController', CourseController);

function CourseController($scope, $rootScope,$routeParams, IdentityService, MsgFlashService, $timeout, $location) {

    //SelectList for TransportTypes
    $scope.selecListChoices = {
        availableOptions: [
          //{ TransportID: '1', TransportName: 'Option A' },
          //{ TransportID: '2', TransportName: 'Option B' },
          //{ TransportID: '3', TransportName: 'Option C' }
        ],
        selectedOption: { TransportID: '1', TransportName: 'Taxi' } //This sets the default value of the select in the ui
    };

    //TODO change move ajax calls to a service

    $scope.currentCourse = {};

    $scope.onEdit = function (id){
      console.log("onEditCourse");
      $location.path("/courses/edit/" + id)
    }


    $scope.getTransportTypes = function () {
        $.ajax({
            method: 'GET',
            url: "http://localhost:53762/api/Transports/",
            headers: headers
        })
            .success(function (data) {
                //console.log("Data from API ", data);
                for (var i = 0; i < data.length; i++) {
                    $scope.selecListChoices.availableOptions[i] = data[i];
                }
                $scope.selecListChoices.selectedOption = $scope.selecListChoices.availableOptions[0];
                //$scope.selecListChoices.availableOptions = data;
                //console.log("Data from selecListChoices array ", $scope.selecListChoices);
                $scope.$apply();
            })
            .error(function (error) {
                console.log(error);
            });
    }

    angular.element(document).ready(function () {
        $scope.getTransportTypes();
    });

    //messages from the msgservice
    //$scope.flashMessage = MsgFlashService.getMessage();
    //$scope.flashErrors = MsgFlashService.getErrorMessage();
    $scope.flashMessage = "";
    $scope.flashErrors = "";
    $scope.showAlertSucess = false;
    $scope.showAlertError = false;

    $scope.errorMessages = [];

    $scope.hasErrors = false;

    ////show or not to show the messages
    //$scope.showAlertSucess = MsgFlashService.showMessage;
    //$scope.showAlertError = MsgFlashService.showErrorMessage;
    //MsgFlashService.hideMessages();

    var headers = {};
    headers.Authorization = 'Bearer ' + IdentityService.getToken();

    $scope.courses = [];


    //examples
    //MsgFlashService.setMessage("Succesfull! Hurray you're now one of us");
    //MsgFlashService.hideMessages();

    //MsgFlashService.setErrorMessage("an error occured, please try again");
    //MsgFlashService.hideMessages();

    $scope.getCourse = function (id) {
        console.log("getCourse ID = " + id);

        $.ajax({
            method: 'GET',
            url: "http://localhost:53762/api/Courses/"+id,
            dataType: 'json',
            contentType: 'application/json',
            headers: headers

        })
        .success(function (data) {
            console.log("getCourse: OK");
            //console.log(data);
            $scope.currentCourse = data;
            console.log("Current course : ", $scope.currentCourse);
            $scope.$apply();
        })
        .fail(function (error){
          console.log("oups ",error);
        });
    }

    $scope.addCourse = function (TransportName) {

      //Format the result of chromes date picker
      var StartDateFormated = $scope.StartDate.toISOString();
      var EndDateFormated = $scope.EndDate.toISOString();
        $.ajax({
            method: 'POST',
            url: "http://localhost:53762/api/Courses/",
            headers: headers,
            data:
                {
                    StartDate: StartDateFormated,
                    EndDate: EndDateFormated,
                    DestinationAddress: $scope.DestinationAddress,
                    DepartureAddress: $scope.DepartureAddress,
                    TransportCompanyName: $scope.TransportCompanyName,
                    TransportName: TransportName
                }
        })
            .success(function (data) {
                console.log(data);
                MsgFlashService.setMessage("Succesfully added your course to this travel! You are now going to be redirected back to index");
                $scope.flashMessage = MsgFlashService.getMessage();
                $scope.showAlertSucess = MsgFlashService.showMessage;
                $scope.$apply();
                $timeout(function () {
                    $location.path("/courses")
                }, 2000);
            })
            .error(function (error) {
                MsgFlashService.setErrorMessage(error.responseText);
                $scope.flashErrors = MsgFlashService.getErrorMessage();
                $scope.showAlertError = MsgFlashService.showErrorMessage;
                //console.log(error);

                var modelState = $.parseJSON(error.responseText).ModelState
                //console.log(modelState);

                $scope.errorMessages = [];

                if (modelState) {

                    var modelStateDepartureAddressRequired = modelState["courseDTO.DepartureAddress"];
                    var modelStateDestinationAddressRequired = modelState["courseDTO.DestinationAddress"];
                    var modelStateEndDateRequired = modelState["courseDTO.EndDate"];
                    var modelStateStartDateRequired = modelState["courseDTO.StartDate"];
                    var modelStateTransportCompanyNameRequired = modelState["courseDTO.TransportCompanyName"];

                    if (modelStateDepartureAddressRequired) {
                        var DepartureMess = modelStateDepartureAddressRequired[0];
                        if (DepartureMess) {
                            $scope.errorMessages.push(DepartureMess);
                        }
                    }
                    if (modelStateDestinationAddressRequired) {
                        var DestinationMess = modelStateDestinationAddressRequired[0];
                        if (DestinationMess) {
                            $scope.errorMessages.push(DestinationMess);
                        }
                    }
                    if (modelStateEndDateRequired) {
                        var EndDateMess = modelStateEndDateRequired[0];
                        if (EndDateMess) {
                            $scope.errorMessages.push(EndDateMess);
                        }
                    }
                    if (modelStateStartDateRequired) {
                        var StartDateMess = modelStateStartDateRequired[0];
                        if (StartDateMess) {
                            $scope.errorMessages.push(StartDateMess);
                        }
                    }
                    if (modelStateTransportCompanyNameRequired) {
                        var TransportNameMess = modelStateTransportCompanyNameRequired[0];
                        if (TransportNameMess) {
                            $scope.errorMessages.push(TransportNameMess);
                        }
                    }

                    $scope.hasErrors = true;
                }
                console.log("ErrorMessages Array: " ,$scope.errorMessages);
                $scope.$apply();
            });
    }

    $scope.getCourses = function () {

        $.ajax({
            method: 'GET',
            url: "http://localhost:53762/api/Courses/",
            headers: headers
        })
            .success(function (data) {
                console.log("Data from API ", data);
                $scope.courses = data;
                //console.log("Data from courses array ", $scope.courses);
                //sets a Position field to items in the array for Listing on the index
                for (var i = 0; i < $scope.courses.length; i++) {
                    //$scope.courses[i].position = i;
                    var course = $scope.courses[i];
                    course.Position = i + 1;
                }
                //console.log("Data from courses array ", $scope.courses);
                $scope.$apply();
            })
            .error(function (error) {
                console.log(error);
            });
    }

    $scope.deleteCourse = function (Id) {
        $.ajax({
            method: 'DELETE',
            url: "http://localhost:53762/api/Courses/" + Id,
            headers: headers
        })
            .success(function (data) {
                console.log("Data from API ", data);
                MsgFlashService.setMessage("Succesfully deleted your course to this travel!");
                $scope.flashMessage = MsgFlashService.getMessage();
                $scope.showAlertSucess = MsgFlashService.showMessage;
                $scope.getCourses();
            })
            .error(function (error) {
                console.log(error);
            });
    }


    $scope.editCourse = function (TransportName) {

        // console.log(Course);
        // console.log(Course.Id);
        // console.log(Course.StartDate);
        // console.log(Course.EndDate);
        // console.log(Course.DestinationAddress);
        // console.log(Course.DepartureAddress);
        // console.log(Course.TransportCompanyName);
        // console.log(Course.TransportName);

        // return;

            $.ajax({
                method: 'PUT',
                url: "http://localhost:53762/api/Courses/" + $scope.currentCourse.CourseID,
                headers: headers,
                data: {
                    Id: $scope.currentCourse.CourseID,
                    StartDate: $scope.currentCourse.StartDate,
                    EndDate: $scope.currentCourse.EndDate,
                    DestinationAddress: $scope.currentCourse.DestinationAddress,
                    DepartureAddress: $scope.currentCourse.DepartureAddress,
                    TransportCompanyName: $scope.currentCourse.TransportCompanyName,
                    TransportName: TransportName
                }
            })
                .success(function (data) {
                    console.log("Successfully updated the course");
                    $scope.getCourses();
                    $scope.$apply(function(){
                      MsgFlashService.setMessage("Succesfully update your course to this travel! You are now going to be redirected back to index");
                      $scope.flashMessage = MsgFlashService.getMessage();
                      $scope.showAlertSucess = MsgFlashService.showMessage;
                      $timeout(function () {
                          $location.path("/courses")
                      }, 2000);
                    });
                })
                .error(function (error) {
                    console.log(error);
                });
        }


    console.log("Action: " + $routeParams.action);
    if ($routeParams.action == "add") {

    } else if ($routeParams.action == "edit") {
        $scope.getCourse($routeParams.id);
    } else if ($routeParams.action === undefined) {
        $scope.getCourses();
    }

}
//added a indexofObject to Array
//Array.prototype.indexOfObject = function (property, value)
//{
//    for (var i = 0, len = this.length; i < len; i++)
//    {
//        if (this[i][property] === value) return i;
//    }
//    return -1;
//};
