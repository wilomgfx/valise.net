angular.module('AppAirBermudes.courses', ['ngRoute'])
.controller('CourseController', CourseController);

function CourseController($scope, $rootScope, MsgFlashService, $timeout) {

    //messages from the msgservice
    $scope.flashMessage = MsgFlashService.getMessage();
    $scope.flashErrors = MsgFlashService.getErrorMessage();

    //show or not to show the messages
    $scope.showAlertSucess = MsgFlashService.showMessage;
    $scope.showAlertError = MsgFlashService.showErrorMessage;


    //examples
    //MsgFlashService.setMessage("Succesfull! Hurray you're now one of us");
    //MsgFlashService.hideMessages();

    //MsgFlashService.setErrorMessage("an error occured, please try again");
    //MsgFlashService.hideMessages();


    $scope.addCourse = function()
    {
        $scope.starDate = "";
        $scope.endDate = "";
        $scope.destinationAddress = "";
        $scope.departureAddress = "";


        $.ajax({
            method: 'POST',
            url: "http://localhost:53762/api/Course/",
            data:
                {
                    Startate: starDate,
                    EndDate: endDate,
                    DestinationAddress: destinationAddress,
                    DepartureAddress: departureAddress
                }
            })
            .success(function (data) {

                if (successCallback) {

                    //$('#loading').hide();
                    successCallback(data);
                }
            })
            .error(function (error) {

                if (errorCallback) {

                    //$('#loading').hide();
                    errorCallback(error);
                }
            });
    }


};