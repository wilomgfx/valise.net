angular
    .module('AppAirBermudes.travels', [])
    .controller('TravelsController', TravelsController);

function TravelsController($scope, $rootScope, $http, $route, $sce, AuthService, MsgFlashService, UserService) {
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

    $scope.TOKEN_KEY = UserService.getTokenKey();
    $scope.USERNAME_KEY = UserService.getUsernameKey();

    $scope.today = calculateToday();

    function calculateToday()
    {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var mmm = today.getMinutes();
        var ss = today.getSeconds();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        if (mmm < 10) {
            mmm = '0' + mmm
        }

        if (hh < 10) {
            hh = '0' + hh
        }

        if (ss < 10) {
            ss = '0' + ss
        }
        // Date format : mm/dd/yyyyThh:mm:ss
        var formatted = mm + '/' + dd + '/' + yyyy + "T" + hh + ":" + mmm + ":" + ss;

        return formatted;
    }
    
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

    if (localStorage.getItem($scope.TOKEN_KEY)) {
        $rootScope.connected = true;
        //$scope.$apply();
        $rootScope.username = localStorage.getItem($scope.USERNAME_KEY);
        AuthService.setLoggedInUser(localStorage.getItem($scope.USERNAME_KEY));
    }
    else {
        $rootScope.connected = false;
        //$scope.$apply();
    }

    $scope.FetchTravels = function () {
        verifyLogIn();

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
                var arrDateBeg = data[x].DateBegin.toString().split("T");
                var arrDateEnd = data[x].DateEnd.toString().split("T");

                data[x].DateBegin = arrDateBeg[0] + " " + arrDateBeg[1];
                data[x].DateEnd = arrDateEnd[0] + " " + arrDateEnd[1];
                $rootScope.travels.push(data[x]);
            }

            MsgFlashService.setErrorMessage("");
            MsgFlashService.setMessage("Succes!");
            $rootScope.showTravels = true;
            $scope.$apply();
        });
    }

    $scope.CreateTravel = function () {
        verifyLogIn();

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
            var mmm = today.getMinutes();
            var ss = today.getSeconds();

            if(dd<10) {
                dd='0'+dd
            } 

            if(mm<10) {
                mm='0'+mm
            }

            if (mmm < 10) {
                mmm = '0' + mmm
            }

            if (hh < 10) {
                hh = '0' + hh
            }

            if (ss < 10) {
                ss = '0' + ss
            }
            // Date format : mm/dd/yyyy hh:mm
            var formatted = mm + '/' + dd + '/' + yyyy + " " + hh + ":" + mmm + ":" + ss;

            $scope.datebegin = formatted;

            var basedate = new Date();
            var dateahead = basedate + 1000 * 60 * 60 * 24 * $scope.nbrofdays;   // current date's milliseconds - 1,000 ms * 60 s * 60 mins * 24 hrs * (# of days beyond one to go back)
            dateahead = new Date(dateahead);

            var dd2 = dateahead.getDate();
            var mm2 = dateahead.getMonth()+1; //January is 0!
            var yyyy2 = dateahead.getFullYear();
            var hh2 = dateahead.getHours();
            var mmm2 = dateahead.getMinutes();
            var ss2 = dateahead.getSeconds();

            if (dd2 < 10) {
                dd2 = '0' + dd2
            }

            if (mm < 10) {
                mm2 = '0' + mm2
            }

            if (mmm2 < 10) {
                mmm2 = '0' + mmm2
            }

            if (hh2 < 10) {
                hh2 = '0' + hh2
            }

            if (ss2 < 10) {
                ss2 = '0' + ss2
            }

            // Date format : mm/dd/yyyy hh:mm
            var formattedAhead = mm2 + '/' + dd2 + '/' + yyyy2 + " " + hh2 + ":" + mmm2 + ":" + ss2;

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
                Title: $scope.traveltitle,
                DateBegin: $scope.datebegin,
                DateEnd: $scope.dateend,
                Budget: $scope.budget,
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

    function verifyLogIn() {
        if (localStorage.getItem($scope.TOKEN_KEY)) {
            $rootScope.connected = true;
            //$scope.$apply();
            $rootScope.username = localStorage.getItem($scope.USERNAME_KEY);
            AuthService.setLoggedInUser(localStorage.getItem($scope.USERNAME_KEY));
        }
        else {
            $rootScope.connected = false;
            //$scope.$apply();
        }
    }
}


/*
function TravelsController($scope, $rootScope, $http, $route, $sce, AuthService, MsgFlashService, UserService) {
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

    $scope.TOKEN_KEY = UserService.getTokenKey();
    $scope.USERNAME_KEY = UserService.getUsernameKey();

    $scope.today = calculateToday();

    function calculateToday() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var mmm = today.getMinutes();
        var ss = today.getSeconds();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        if (mmm < 10) {
            mmm = '0' + mmm
        }

        if (hh < 10) {
            hh = '0' + hh
        }

        if (ss < 10) {
            ss = '0' + ss
        }
        // Date format : mm/dd/yyyyThh:mm:ss
        var formatted = mm + '/' + dd + '/' + yyyy + "T" + hh + ":" + mmm + ":" + ss;

        return formatted;
    }

    $scope.baseURLTravels = "http://localhost:53762/api/Travels/";

    $scope.SetChoiceByDays = function () {
        $rootScope.showByDates = false;
        $rootScope.showByDays = true;
    }

    $scope.SetChoiceByDates = function () {
        $rootScope.showByDates = true;
        $rootScope.showByDays = false;
    }

    if (localStorage.getItem($scope.TOKEN_KEY)) {
        $rootScope.connected = true;
        //$scope.$apply();
        $rootScope.username = localStorage.getItem($scope.USERNAME_KEY);
        AuthService.setLoggedInUser(localStorage.getItem($scope.USERNAME_KEY));
    }
    else {
        $rootScope.connected = false;
        //$scope.$apply();
    }

    $scope.FetchTravels = function () {
        verifyLogIn();

        if (AuthService.getLoggedInUser() === "") {
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
                var arrDateBeg = data[x].DateBegin.toString().split("T");
                var arrDateEnd = data[x].DateEnd.toString().split("T");

                data[x].DateBegin = arrDateBeg[0] + " " + arrDateBeg[1];
                data[x].DateEnd = arrDateEnd[0] + " " + arrDateEnd[1];
                $rootScope.travels.push(data[x]);
            }

            MsgFlashService.setErrorMessage("");
            MsgFlashService.setMessage("Succes!");
            $rootScope.showTravels = true;
            $scope.$apply();
        });
    }

    $scope.CreateTravel = function () {
        verifyLogIn();

        if (AuthService.getLoggedInUser() === "") {
            alert("Vous devez d'abord vous connecter.");
            return;
        }

        if ($scope.showByDays) {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            var hh = today.getHours();
            var mmm = today.getMinutes();
            var ss = today.getSeconds();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            if (mmm < 10) {
                mmm = '0' + mmm
            }

            if (hh < 10) {
                hh = '0' + hh
            }

            if (ss < 10) {
                ss = '0' + ss
            }
            // Date format : mm/dd/yyyy hh:mm
            var formatted = mm + '/' + dd + '/' + yyyy + " " + hh + ":" + mmm + ":" + ss;

            $scope.datebegin = formatted;

            var basedate = new Date();
            var dateahead = basedate + 1000 * 60 * 60 * 24 * $scope.nbrofdays;   // current date's milliseconds - 1,000 ms * 60 s * 60 mins * 24 hrs * (# of days beyond one to go back)
            dateahead = new Date(dateahead);

            var dd2 = dateahead.getDate();
            var mm2 = dateahead.getMonth() + 1; //January is 0!
            var yyyy2 = dateahead.getFullYear();
            var hh2 = dateahead.getHours();
            var mmm2 = dateahead.getMinutes();
            var ss2 = dateahead.getSeconds();

            if (dd2 < 10) {
                dd2 = '0' + dd2
            }

            if (mm < 10) {
                mm2 = '0' + mm2
            }

            if (mmm2 < 10) {
                mmm2 = '0' + mmm2
            }

            if (hh2 < 10) {
                hh2 = '0' + hh2
            }

            if (ss2 < 10) {
                ss2 = '0' + ss2
            }

            // Date format : mm/dd/yyyy hh:mm
            var formattedAhead = mm2 + '/' + dd2 + '/' + yyyy2 + " " + hh2 + ":" + mmm2 + ":" + ss2;

            $scope.dateend = formattedAhead;
        }
        else {
            $scope.datebegin = $scope.travelstart;
            $scope.dateend = $scope.travelend;
        }

        $.ajax({
            type: 'POST',
            url: $scope.baseURLTravels,
            data:
            {
                Title: $scope.traveltitle,
                DateBegin: $scope.datebegin,
                DateEnd: $scope.dateend,
                Budget: $scope.budget,
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

    function verifyLogIn() {
        if (localStorage.getItem($scope.TOKEN_KEY)) {
            $rootScope.connected = true;
            //$scope.$apply();
            $rootScope.username = localStorage.getItem($scope.USERNAME_KEY);
            AuthService.setLoggedInUser(localStorage.getItem($scope.USERNAME_KEY));
        }
        else {
            $rootScope.connected = false;
            //$scope.$apply();
        }
    }
}
*/