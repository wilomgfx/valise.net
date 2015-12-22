angular.module('AppAirBermudes.share', ['ngRoute'])
.controller('ShareController', ShareController)
.service('DataService', DataService);


function ShareController($scope, $rootScope, $routeParams, $location, IdentityService, MsgFlashService, DataService, $timeout) {

    //messages from the msgservice
    $scope.flashMessage = MsgFlashService.getMessage();
    $scope.flashErrors = MsgFlashService.getErrorMessage();

    //show or not to show the messages
    $scope.showAlertSucess = MsgFlashService.showMessage;
    $scope.showAlertError = MsgFlashService.showErrorMessage;
    MsgFlashService.hideMessages();

    $scope.DataService = DataService;

    $scope.users = [];

    var token = IdentityService.getToken();

    $scope.baseURLShare = "http://localhost:53762/api/Share/";

    $scope.$watch('DataService.users', function (newVal, oldVal, scope) {
        if (newVal) {
            $scope.users = DataService.users;
        }
    });

    DataService.users = fetchUsers();

    function fetchUsers()
    {
        // CALL API!

        $.ajax({
            method: 'GET',
            url: $scope.baseURLShare + DataService.currentTravel.TravelId,
            headers: { Authorization: 'Bearer ' + token }
        }).fail(function (error) {

            alert(error);

        }).success(function (data) {
            DataService.users = data;
            $scope.$apply();
        });
    }

    $scope.onAddUser = function () {
        console.log("onAddUser");
        
        // CALL API!

        var data = {
            username: $scope.userToAdd,
            travelid: DataService.currentTravel.TravelId
        };

        $.ajax({
            method: 'POST',
            url: $scope.baseURLShare,
            headers: { Authorization: 'Bearer ' + token },
            data: data
        }).fail(function (error) {

            alert(error);

        }).success(function (data) {

            var user2 = {
                username: $scope.userToAdd
            }

            DataService.users.pushUser(user2);
            $scope.$apply();
        });

    }  

    $scope.onDeleteUser = function (user) {
        console.log("onDeleteUser");

        // CALL API!

        var data = {
            username: $scope.userToAdd,
            travelid: DataService.currentTravel.TravelId
        };

        $.ajax({
            method: 'DELETE',
            url: $scope.baseURLShare,
            headers: { Authorization: 'Bearer ' + token },
            data: data
        }).fail(function (error) {

            alert(error);

        }).success(function (data) {

            var user2 = {
                username: $scope.userToAdd
            }

            DataService.removeUser(user2);
            $scope.$apply();
        });

        
    }   
}
