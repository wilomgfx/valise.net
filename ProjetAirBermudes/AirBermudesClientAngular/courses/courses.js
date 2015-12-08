angular.module('AppAirBermudes.courses', ['ngRoute'])
.controller('CourseController', CourseController);

function CourseController($scope, $rootScope,IdentityService, MsgFlashService, $timeout) {

    //messages from the msgservice
    $scope.flashMessage = MsgFlashService.getMessage();
    $scope.flashErrors = MsgFlashService.getErrorMessage();

    //show or not to show the messages
    $scope.showAlertSucess = MsgFlashService.showMessage;
    $scope.showAlertError = MsgFlashService.showErrorMessage;

    var headers = {};
    headers.Authorization = 'Bearer ' + IdentityService.getToken();
    

    console.log(headers);
    console.log(IdentityService.getToken());

    //examples
    //MsgFlashService.setMessage("Succesfull! Hurray you're now one of us");
    //MsgFlashService.hideMessages();

    //MsgFlashService.setErrorMessage("an error occured, please try again");
    //MsgFlashService.hideMessages();


    $scope.addCourse = function (StartDate, DepartureAddress, DestinationAddress, EndDate)
    {


        $scope.starDate = StartDate;
        $scope.endDate = EndDate;
        $scope.destinationAddress = DestinationAddress;
        $scope.departureAddress = DepartureAddress;

        console.log(StartDate + " " + EndDate + " " + DestinationAddress + " " + DepartureAddress);

        $.ajax({
            method: 'POST',
            url: "http://localhost:53762/api/Courses/",
            headers: headers,
            data:
                {
                    Startate: $scope.starDate,
                    EndDate: $scope.endDate,
                    DestinationAddress: $scope.destinationAddress,
                    DepartureAddress: $scope.departureAddress
                }
            })
            .success(function (data) {
                console.log(data);
            })
            .error(function (error) {
                console.log(error);
            });
    }


};