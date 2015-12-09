angular.module('AppAirBermudes.courses', ['ngRoute'])
.controller('CourseController', CourseController);

function CourseController($scope, $rootScope, IdentityService, MsgFlashService, $timeout) {

    //SelectList for TransportTypes
    $scope.selecListChoices = {
        availableOptions: [
          //{ TransportID: '1', TransportName: 'Option A' },
          //{ TransportID: '2', TransportName: 'Option B' },
          //{ TransportID: '3', TransportName: 'Option C' }
        ],
        selectedOption: { TransportID: '1', TransportName: 'Taxi' } //This sets the default value of the select in the ui
    };

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
    $scope.flashMessage = MsgFlashService.getMessage();
    $scope.flashErrors = MsgFlashService.getErrorMessage();

    //show or not to show the messages
    $scope.showAlertSucess = MsgFlashService.showMessage;
    $scope.showAlertError = MsgFlashService.showErrorMessage;

    var headers = {};
    headers.Authorization = 'Bearer ' + IdentityService.getToken();

    $scope.courses = [];


    //examples
    //MsgFlashService.setMessage("Succesfull! Hurray you're now one of us");
    //MsgFlashService.hideMessages();

    //MsgFlashService.setErrorMessage("an error occured, please try again");
    //MsgFlashService.hideMessages();


    $scope.addCourse = function (StartDate, DepartureAddress, DestinationAddress, EndDate, TransportCompanyName, TransportName) {


        $scope.StartDate = StartDate;
        $scope.endDate = EndDate;
        $scope.destinationAddress = DestinationAddress;
        $scope.departureAddress = DepartureAddress;
        $scope.transportCompanyName = TransportCompanyName;
        $scope.transPortName = TransportName;


        //console.log(StartDate + " " + EndDate + " " + DestinationAddress + " " + DepartureAddress);

        $.ajax({
            method: 'POST',
            url: "http://localhost:53762/api/Courses/",
            headers: headers,
            data:
                {
                    StartDate: $scope.StartDate,
                    EndDate: $scope.endDate,
                    DestinationAddress: $scope.destinationAddress,
                    DepartureAddress: $scope.departureAddress,
                    TransportCompanyName: $scope.transportCompanyName,
                    TransportName: $scope.transPortName
                }
        })
            .success(function (data) {
                console.log(data);
            })
            .error(function (error) {
                console.log(error);
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
                console.log("Data from courses array ", $scope.courses);
                //sets a pos field to items in the array for Listing on the index
                for (var i = 0; i < $scope.courses.length; i++) {
                    //$scope.courses[i].position = i;
                    var course = $scope.courses[i];
                    course.Position = i + 1;
                }
                console.log("Data from courses array ", $scope.courses);
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
                $scope.getCourses();
            })
            .error(function (error) {
                console.log(error);
            });
    }

    $scope.editCourse = function (Id, Course) {

        //console.log(Course);
        //console.log(Course.Id);
        //console.log(Course.StartDate);
        //console.log(Course.EndDate);
        //console.log(Course.DestinationAddress);
        //console.log(Course.DepartureAddress);
        //console.log(Course.TransportCompanyName);
        //console.log(Course.TransportName);

        //return;

            $.ajax({
                method: 'PUT',
                url: "http://localhost:53762/api/Courses/" + Id,
                headers: headers,
                data: {
                    Id: Course.Id,
                    Startate: Course.StartDate,
                    EndDate: Course.EndDate,
                    DestinationAddress: Course.DestinationAddress,
                    DepartureAddress: Course.DepartureAddress,
                    TransportCompanyName: Course.TransportCompanyName,
                    TransportName: Course.TransportName
                }
            })
                .success(function (data) {
                    console.log("Data from API ", data);
                    $scope.getCourses();
                })
                .error(function (error) {
                    console.log(error);
                });
        }


};
//added a indexofObject to Array
//Array.prototype.indexOfObject = function (property, value)
//{
//    for (var i = 0, len = this.length; i < len; i++)
//    {
//        if (this[i][property] === value) return i;
//    }
//    return -1;
//};