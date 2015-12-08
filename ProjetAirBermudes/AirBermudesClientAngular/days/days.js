angular.module('AppAirBermudes.days', ['ngRoute'])
.controller('DaysController', DaysController)
.service('DaysService', DaysService);

function DaysController($scope, $rootScope, IdentityService, MsgFlashService, DaysService, $timeout) {

    //messages from the msgservice
    $scope.flashMessage = MsgFlashService.getMessage();
    $scope.flashErrors = MsgFlashService.getErrorMessage();

    //show or not to show the messages
    $scope.showAlertSucess = MsgFlashService.showMessage;
    $scope.showAlertError = MsgFlashService.showErrorMessage;
    MsgFlashService.hideMessages();
    
    $scope.dayList = [];
    $scope.currentDay = null;

    //examples
    //MsgFlashService.setMessage("Succesfull! Hurray you're now one of us");
    //MsgFlashService.hideMessages();

    //MsgFlashService.setErrorMessage("an error occured, please try again");
    //MsgFlashService.hideMessages();
    
    
        
    $scope.saveDay = function() {
        if($scope.currentDay == null)
            return;
        
        DaysService.saveDay($scope.currentDay);
    }

    $scope.dayList = DaysService.loadDays();


};

function DaysService($http) {
    var baseUrl = "http://localhost:53762/api/Days";
    var self = this;
    var DayList = [];
    
    this.loadDays = function() {
        console.log("loadDays");
        var headers = {};
        // For use later
        /*var token =   IdentityService.getToken();
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }*/
        
        $http({
            method: 'GET',
            url: baseUrl,
            dataType: 'json',
            contentType: 'application/json'
            //headers: headers
            
        })
        .success(function (data) {
            console.log("loadDays: OK");
            console.log(data);
            DayList = data;
        });
    }

    this.saveDay = function (day) {
        console.log("saveDay");
        var headers = {};
        // For use later
        /*var token =   IdentityService.getToken();
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }*/

        $http({
            method: 'POST',
            url: baseUrl,
            dataType: 'json',
            contentType: 'application/json',
            //headers: headers,
            data: day
        })
        .success(function (data) {
            console.log("saveDay: OK");
            console.log(data);
            return data;
        });
    }
};