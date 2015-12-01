angular
    .module('AppAirBermudes.travels', [])
    .controller('TravelsController', TravelsController);

function TravelsController($scope, $rootScope, $http, $route, $sce, AuthService, MsgFlashService) {
    $rootScope.travels = [];
    $rootScope.showTravels = false;
    $rootScope.showByDates = false;
    $rootScope.showByDays = false;

    //messages from the msgservice
    $scope.flashMessage = MsgFlashService.getMessage();
    $scope.flashErrors = MsgFlashService.getErrorMessage();

    //show or not to show the messages
    $scope.showAlertSucess = MsgFlashService.showMessage;
    $scope.showAlertError = MsgFlashService.showErrorMessage;
    
    $scope.baseURLTravels = "http://localhost:53762/api/Travels/";

    $scope.SetChoiceByDays = function()
    {
        $rootScope.showByDates = false;
        $rootScope.showByDays = true;
    }

    $scope.SetChoiceByDates = function()
    {
        $rootScope.showByDates = true;
        $rootScope.showByDays = false;
    }

    $scope.FetchTravels = function () {
        if(AuthService.getLoggedInUser() === "")
        {
            alert("Vous devez d'abord vous connecter.");
            return;
        }
        $.ajax({
            type: 'GET',
            url: $scope.baseURLTravels + "?username=" + AuthService.getLoggedInUser()
        }).fail(function (error) {
            MsgFlashService.setErrorMessage("Une erreur est survenue lors de la recuperation : " + error.responseText);
            $scope.$apply();
        }).success(function (data) {
            console.log(data);

            $rootScope.travels = [];
            for (x in data) {
                $rootScope.travels.push(data[x]);
            }

            MsgFlashService.setErrorMessage("");
            MsgFlashService.setMessage("Succes!");
            $rootScope.showTravels = true;
            $scope.$apply();
        });
    }

    $scope.CreateTravel = function () {
        if (AuthService.getLoggedInUser() === "") {
            alert("Vous devez d'abord vous connecter.");
            return;
        }
        
        if($scope.showByDays)
        {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            var hh = today.getHours();
            var mm = today.getMinutes();
            var ss = today.getSeconds();

            if(dd<10) {
                dd='0'+dd
            } 

            if(mm<10) {
                mm='0'+mm
            } 
            // Date format : mm/dd/yyyy hh:mm
            var formatted = mm+'/'+dd+'/'+yyyy + " " + hh + ":" + mm + ":" + ss;

            $scope.datebegin = formatted;

            ​var basedate = new Date();
            var dateahead = basedate + 1000 * 60 * 60 * 24 * $scope.nbrofdays;   // current date's milliseconds - 1,000 ms * 60 s * 60 mins * 24 hrs * (# of days beyond one to go back)
            dateahead = new Date(yesterday);

            var dd2 = dateahead.getDate();
            var mm2 = dateahead.getMonth()+1; //January is 0!
            var yyyy2 = dateahead.getFullYear();
            var hh2 = dateahead.getHours();
            var mm2 = dateahead.getMinutes();
            var ss2 = dateahead.getSeconds();

            // Date format : mm/dd/yyyy hh:mm
            var formattedAhead = mm2+'/'+dd2+'/'+yyyy2 + " " + hh2 + ":" + mm2 + ":" + ss2;

            $scope.dateend = formattedAhead;
        }
        else
        {
            $scope.datebegin = $scope.travelstart;
            $scope.dateend = $scope.travelend;
        }

        $.ajax({
            type: 'POST',
            url: $scope.baseURLTravels,
            data:
            {
                title: $scope.traveltitle,
                datebegin: $scope.datebegin,
                dateend: $scope.dateend,
                budget: $scope.budget,
                username: AuthService.getLoggedInUser()
            }

        }).fail(function (error) {
            //$scope.errorHappened = true;
            MsgFlashService.setErrorMessage("Une erreur est survenue lors de la création : " + error.responseText);
            $scope.$apply();
        }).success(function (data) {
            console.log(data);

            $scope.FetchMemos();
            $scope.memotitle = "";
            $scope.memocontent = "";

            MsgFlashService.setErrorMessage("");
            MsgFlashService.setMessage("Succes!");
            $scope.$apply();
        });
    }

    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        });
    }
}