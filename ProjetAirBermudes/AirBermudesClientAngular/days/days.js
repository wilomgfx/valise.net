angular.module('AppAirBermudes.days', ['ngRoute'])
.controller('DaysController', DaysController)
.service('DaysService', DaysService)
.service('DataService', DataService);


function DaysController($scope, $rootScope, IdentityService, MsgFlashService, DaysService, DataService, $timeout) {

    //messages from the msgservice
    $scope.flashMessage = MsgFlashService.getMessage();
    $scope.flashErrors = MsgFlashService.getErrorMessage();

    //show or not to show the messages
    $scope.showAlertSucess = MsgFlashService.showMessage;
    $scope.showAlertError = MsgFlashService.showErrorMessage;
    MsgFlashService.hideMessages();
    
    $scope.DataService = DaysService;
    $scope.DataService = DataService;
    
    $scope.dayList = [];
    $scope.$watch('DataService.dayList', function (newVal, oldVal, scope) {
        if (newVal) {
            $scope.dayList = DataService.dayList;
        }
    });

    $scope.currentDay = null;

    //examples
    //MsgFlashService.setMessage("Succesfull! Hurray you're now one of us");
    //MsgFlashService.hideMessages();

    //MsgFlashService.setErrorMessage("an error occured, please try again");
    //MsgFlashService.hideMessages();
    
    
        
    $scope.saveDay = function(day) {
        if(day == null)
            return;
        
        alert(day);
        DaysService.saveDay(day);
        $scope.dayList.push(day);
    }

    DaysService.loadDays();


};

function DataService() {
    this.dayList = [];
}

function DaysService($http, DataService) {
    var baseUrl = "http://localhost:53762/api/Days";
    //var self = this;
    this.dayList = [];
    
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
            DataService.dayList = data;
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