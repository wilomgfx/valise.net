﻿angular.module('AppAirBermudes.courses', ['ngRoute'])
.controller('CourseController', CourseController);

function CourseController($scope, $rootScope, IdentityService, MsgFlashService, $timeout) {

    //messages from the msgservice
    $scope.flashMessage = MsgFlashService.getMessage();
    $scope.flashErrors = MsgFlashService.getErrorMessage();

    //show or not to show the messages
    $scope.showAlertSucess = MsgFlashService.showMessage;
    $scope.showAlertError = MsgFlashService.showErrorMessage;

    var headers = {};
    headers.Authorization = 'Bearer ' + IdentityService.getToken();

    $scope.courses = [];

    //SelectList for TransportTypes
    $scope.selecListChoices = {
        availableOptions: [
          { id: '1', name: 'Option A' },
          { id: '2', name: 'Option B' },
          { id: '3', name: 'Option C' }
        ],
        selectedOption: { id: '1', name: 'Option A' } //This sets the default value of the select in the ui
    };


    //examples
    //MsgFlashService.setMessage("Succesfull! Hurray you're now one of us");
    //MsgFlashService.hideMessages();

    //MsgFlashService.setErrorMessage("an error occured, please try again");
    //MsgFlashService.hideMessages();


    $scope.addCourse = function (StartDate, DepartureAddress, DestinationAddress, EndDate, TransportCompanyName) {


        $scope.starDate = StartDate;
        $scope.endDate = EndDate;
        $scope.destinationAddress = DestinationAddress;
        $scope.departureAddress = DepartureAddress;
        $scope.transportCompanyName = TransportCompanyName;

        //console.log(StartDate + " " + EndDate + " " + DestinationAddress + " " + DepartureAddress);

        $.ajax({
            method: 'POST',
            url: "http://localhost:53762/api/Courses/",
            headers: headers,
            data:
                {
                    Startate: $scope.starDate,
                    EndDate: $scope.endDate,
                    DestinationAddress: $scope.destinationAddress,
                    DepartureAddress: $scope.departureAddress,
                    TransportCompanyName: $scope.transportCompanyName
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

        console.log(Course);

        //    $.ajax({
        //        method: 'PUT',
        //        url: "http://localhost:53762/api/Courses/" + Id,
        //        dataType: "json",
        //        contentType: "application/json",
        //        headers: headers,
        //        data: {
        //            CourseDTO: Course
        //        }
        //    })
        //        .success(function (data) {
        //            console.log("Data from API ", data);
        //            $scope.getCourses();
        //        })
        //        .error(function (error) {
        //            console.log(error);
        //        });
        //}


    };
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