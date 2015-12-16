angular.module('AppAirBermudes.days', ['ngRoute'])
.controller('DaysController', DaysController)
.service('DaysService', DaysService)
.service('DataService', DataService);


function DaysController($scope, $rootScope, $routeParams, $location, IdentityService, MsgFlashService, DaysService, DataService, $timeout) {

    //messages from the msgservice
    $scope.flashMessage = MsgFlashService.getMessage();
    $scope.flashErrors = MsgFlashService.getErrorMessage();

    //show or not to show the messages
    $scope.showAlertSucess = MsgFlashService.showMessage;
    $scope.showAlertError = MsgFlashService.showErrorMessage;
    MsgFlashService.hideMessages();
    
    $scope.DataService = DataService;
        
    $scope.days = [];
    $scope.currentDay = DataService.currentDay;
    
    $scope.$watch('DataService.days', function (newVal, oldVal, scope) {
        if (newVal) {
            $scope.days = DataService.days;
        }
    });

    $scope.$watch('DataService.currentDay', function (newVal, oldVal, scope) {
        if (newVal) {
            $scope.currentDay = DataService.currentDay;
        }
    });
        
    $scope.onAddDay = function () {
        console.log("onAddDay");
        $location.path("/days/add")
    }

    $scope.onEditDay = function (id) {
        console.log("onEditDay");
        $location.path("/days/edit/" + id)
    }

    $scope.onDeleteDay = function (id) {
        console.log("onDeleteDay");
        DaysService.deleteDay(id);
    }

    $scope.saveDay = function() {
        if($scope.currentDay == null)
            return;

        // Synchronous call
        DaysService.saveDay($scope.currentDay)
        .success(function(response) {
            $location.path("/days");
        })
        .error(function (error) {
            if (error == null) {
                MsgFlashService.setErrorMessage("Oops! Can't save. Connection refused");
            } else {
                $scope.errorMessages = [];

                if (error.ModelState) {
                    if (error.ModelState[''] != undefined) {
                        for (index = 0; index < error.ModelState[''].length; index++)
                            $scope.errorMessages.push(error.ModelState[''][index]);
                    }

                    if (error.ModelState['model.Budget'] != undefined) {
                        for (index = 0; index < error.ModelState['model.Budget'].length; index++)
                            $scope.errorMessages.push(error.ModelState['model.Budget'][index]);
                    }

                    if (error.ModelState['model.Date'] != undefined) {
                        for (index = 0; index < error.ModelState['model.Date'].length; index++)
                            $scope.errorMessages.push(error.ModelState['model.Date'][index]);
                    }
                    $scope.hasErrors = true;
                }
            }

            $scope.flashErrors = MsgFlashService.getErrorMessage();
            $scope.showAlertError = MsgFlashService.showErrorMessage;
        });
    }

    console.log("Action: " + $routeParams.action);
    if ($routeParams.action == "add") {
        DaysService.newDay();
    } else if ($routeParams.action == "edit") {
        DaysService.getDay($routeParams.id);
    } else if ($routeParams.action === undefined) {
        DaysService.loadDays();
    }
}

function DataService() {
    this.days = [];
    this.currentDay = {};
}

function DaysService($http, $q, DataService) {
    var baseUrl = "http://localhost:53762/api/Days";
    
    /////////////////////////////////////////////////////////////////////////////
    // GET - ASYNCHRONOUS
    /////////////////////////////////////////////////////////////////////////////
    this.newDay = function () {
        DataService.currentDay = { Date: '', Budget: '' };
    }

    /////////////////////////////////////////////////////////////////////////////
    // LOAD - ASYNCHRONOUS
    /////////////////////////////////////////////////////////////////////////////
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
            DataService.days = data;
        });
    }

    /////////////////////////////////////////////////////////////////////////////
    // GET - ASYNCHRONOUS
    /////////////////////////////////////////////////////////////////////////////
    this.getDay = function (id) {
        console.log("getDay ID = " + id);
        var headers = {};
        // For use later
        /*var token =   IdentityService.getToken();
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }*/

        $http({
            method: 'GET',
            url: baseUrl + '/' + id,
            dataType: 'json',
            contentType: 'application/json'
            //headers: headers

        })
        .success(function (data) {
            console.log("getDay: OK");
            console.log(data);

            data.Date = new Date(data.Date);
            DataService.currentDay = data;
        });
    }

    //////////////////////////////////////////////////////////////////////
    // SAVE - SYNCHRONOUS
    //////////////////////////////////////////////////////////////////////
    this.saveDay = function (day) {
        console.log("saveDay");
        console.log(day);

        var deferred = $q.defer();
        var promise = deferred.promise;

        var headers = {};
        // For use later
        /*var token =   IdentityService.getToken();
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }*/

        if (day.Id === undefined) {
            // It's a brand new day
            $http({
                method: 'POST',
                url: baseUrl,
                dataType: 'json',
                contentType: 'application/json',
                //headers: headers,
                data: day
            })
            .success(function (data) {
                console.log("saveDay: NEW OK");
                console.log(data);
                DataService.days.push(data);
                deferred.resolve('OK');
            })
            .error(function (error) {
                console.log("saveDay: NEW FAIL");
                console.log(error);
                deferred.reject(error);
            })
        } else {
            // It's an update
            $http({
                method: 'PUT',
                url: baseUrl + '/' + day.Id,
                dataType: 'json',
                contentType: 'application/json',
                //headers: headers,
                data: day
            })
            .success(function(data) {
                console.log("saveDay: UPDATE OK");
                console.log(data);
                deferred.resolve('OK');
            })
            .error(function (error) {
                console.log("saveDay: UPDATE FAIL");
                console.log(error);
                deferred.reject(error);
            })
        }

        promise.success = function (fn) {
            promise.then(fn);
            return promise;
        }

        promise.error = function (fn) {
            promise.then(null, fn);
            return promise;
        }

        return promise;
    }

    /////////////////////////////////////////////////////////////////////////////
    // GET - ASYNCHRONOUS
    /////////////////////////////////////////////////////////////////////////////
    this.deleteDay = function (id) {
        console.log("deleteDay ID " + id);
        var headers = {};
        // For use later
        /*var token =   IdentityService.getToken();
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }*/

        $http({
            method: 'DELETE',
            url: baseUrl + '/' + id,
            dataType: 'json',
            contentType: 'application/json',
            //headers: headers,
        })
        .success(function (data) {
            console.log("deleteDay: OK");
            console.log(data);
            
            console.log('Current list length: ' + DataService.days.length);

            for (index = 0; index < DataService.days.length; index++) {
                if (DataService.days[index].Id == id) {
                    DataService.days.splice(index, 1);
                    break;
                }
            }

            console.log('Final list length: ' + DataService.days.length);
        });
    }
};