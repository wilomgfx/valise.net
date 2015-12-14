angular
    .module('AppAirBermudes.travels', ['ui.bootstrap.datetimepicker'])
    .controller('TravelsController', TravelsController)

function TravelsController($scope, $rootScope, $http, $route, $sce, $location, IdentityService, MsgFlashService, DataTransfer) {
    $rootScope.travels = [];
    $rootScope.showTravels = false;
    $rootScope.showByDates = false;
    $rootScope.showByDays = false;

    $scope.dateValues = [];

    

    //messages from the msgservice
    $scope.flashMessage = MsgFlashService.getMessage();
    $scope.flashErrors = MsgFlashService.getErrorMessage();

    //show or not to show the messages
    $scope.showAlertSucess = MsgFlashService.showMessage;
    $scope.showAlertError = MsgFlashService.showErrorMessage;

    //$scope.TOKEN_KEY = UserService.getTokenKey();
    //$scope.USERNAME_KEY = UserService.getUsernameKey();

    $scope.today = calculateToday();

    $scope.dateStartIsGood = false;
    $scope.dateEndIsGood = false;

    $scope.onTimeSetStart = function (newDate, oldDate) {

        var thedate = "" + newDate;

        var dateArray = thedate.split(" ");

        var dayName = dateArray[0];
        var monthName = dateArray[1];
        var daynum = dateArray[2];
        var year = dateArray[3];
        var stringTime = dateArray[4];
        var timeArray = ("" + stringTime).split(":");

        var hours = timeArray[0];
        var minutes = timeArray[1];
        var seconds = timeArray[2];

        var monthnum = 0;

        switch(monthName)
        {
            case "Jan":
                monthnum = 1;
                break;
            case "Feb":
                monthnum = 2;
                break;
            case "Mar":
                monthnum = 3;
                break;
            case "Apr":
                monthnum = 4;
                break;
            case "May":
                monthnum = 5;
                break;
            case "Jun":
                monthnum = 6;
                break;
            case "Jul":
                monthnum = 7;
                break;
            case "Aug":
                monthnum = 8;
                break;
            case "Sep":
                monthnum = 9;
                break;
            case "Oct":
                monthnum = 10;
                break;
            case "Nov":
                monthnum = 11;
                break;
            case "Dec":
                monthnum = 12;
                break;

            default:
                monthnum = -1;
                break;
        }

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var mmm = today.getMinutes();
        var ss = today.getSeconds();

        // Must be set on present day or farther....
        var intMonth = parseInt(monthnum);
        var intYear = parseInt(year);
        var intDay = parseInt(daynum);
        var intHour = parseInt(hours);
        var intMin = parseInt(minutes);
        var intSec = parseInt(seconds);

        var errorHappened = false;

        if (intYear < yyyy)
        {
            //ERROR!
            errorHappened = true;
        }
        else if (intYear === yyyy)
        {
            if(intMonth < mm)
            {
                // ERROR!
                errorHappened = true;
            }
            else if(intMonth === mm)
            {
                if(intDay < dd)
                {
                    // ERROR!
                    errorHappened = true;
                }
                else if(intDay === dd)
                {
                    if(intHour < hh)
                    {
                        // ERROR!
                        errorHappened = true;
                    }
                    else if(intHour === hh)
                    {
                        if(intMin < mmm)
                        {
                            // ERROR!
                            errorHappened = true;
                        }
                        else if(intMin === mmm)
                        {
                            if(intSec < ss)
                            {
                                // ERROR!
                                errorHappened = true;
                            }
                        }
                    }
                }
            }
        }

        if (errorHappened)
        {
            MsgFlashService.setErrorMessage("Erreur: Vous devez choisir une date de départ valide!");
            $scope.flashErrors = MsgFlashService.getErrorMessage();
            $scope.showAlertError = MsgFlashService.showErrorMessage;
            $scope.showAlertSucess = MsgFlashService.showMessage;
            //$scope.$apply();
            $scope.dateStartIsGood = false;
            return;
        }



        $scope.datebegin = monthnum + "/" + daynum + "/" + year + " " + stringTime;
        console.log(newDate);
        console.log(oldDate);
        $scope.dateStartIsGood = true;

        MsgFlashService.hideMessages();
        $scope.showAlertError = MsgFlashService.showErrorMessage;
        $scope.showAlertSucess = MsgFlashService.showMessage;
    }

    $scope.onTimeSetEnd = function (newDate, oldDate) {
        var thedate = "" + newDate;

        var dateArray = thedate.split(" ");

        var dayName = dateArray[0];
        var monthName = dateArray[1];
        var daynum = dateArray[2];
        var year = dateArray[3];
        var stringTime = dateArray[4];
        var timeArray = ("" + stringTime).split(":");

        var hours = timeArray[0];
        var minutes = timeArray[1];
        var seconds = timeArray[2];

        var monthnum = 0;

        switch (monthName) {
            case "Jan":
                monthnum = 1;
                break;
            case "Feb":
                monthnum = 2;
                break;
            case "Mar":
                monthnum = 3;
                break;
            case "Apr":
                monthnum = 4;
                break;
            case "May":
                monthnum = 5;
                break;
            case "Jun":
                monthnum = 6;
                break;
            case "Jul":
                monthnum = 7;
                break;
            case "Aug":
                monthnum = 8;
                break;
            case "Sep":
                monthnum = 9;
                break;
            case "Oct":
                monthnum = 10;
                break;
            case "Nov":
                monthnum = 11;
                break;
            case "Dec":
                monthnum = 12;
                break;

            default:
                monthnum = -1;
                break;
        }

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var mmm = today.getMinutes();
        var ss = today.getSeconds();

        

        // Must be set on present day or farther....
        var intMonth = parseInt(monthnum);
        var intYear = parseInt(year);
        var intDay = parseInt(daynum);
        var intHour = parseInt(hours);
        var intMin = parseInt(minutes);
        var intSec = parseInt(seconds);

        var errorHappened = false;

        if (intYear < yyyy) {
            //ERROR!
            errorHappened = true;
        }
        else if (intYear === yyyy) {
            if (intMonth < mm) {
                // ERROR!
                errorHappened = true;
            }
            else if (intMonth === mm) {
                if (intDay < dd) {
                    // ERROR!
                    errorHappened = true;
                }
                else if (intDay === dd) {
                    if (intHour < hh) {
                        // ERROR!
                        errorHappened = true;
                    }
                    else if (intHour === hh) {
                        if (intMin < mmm) {
                            // ERROR!
                            errorHappened = true;
                        }
                        else if (intMin === mmm) {
                            if (intSec < ss) {
                                // ERROR!
                                errorHappened = true;
                            }
                        }
                    }
                }
            }
        }

        if (errorHappened) {
            MsgFlashService.setErrorMessage("Erreur: Vous devez choisir une date de fin dans le futur!");
            $scope.flashErrors = MsgFlashService.getErrorMessage();
            $scope.showAlertError = MsgFlashService.showErrorMessage;
            $scope.showAlertSucess = MsgFlashService.showMessage;
            //$scope.$apply();
            $scope.dateEndIsGood = false;
            return;
        }



        $scope.dateend = monthnum + "/" + daynum + "/" + year + " " + stringTime;
        console.log(newDate);
        console.log(oldDate);
        $scope.dateEndIsGood = true;
        MsgFlashService.hideMessages();
    }

    //$scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
    //    $scope.dateValues = [];

    //    for (x in $dates)
    //    {
    //        $scope.dateValues.push($dates[x].localDateValue());
    //    }
    //}

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
        var formatted = mm + '/' + dd + '/' + yyyy + " " + hh + ":" + mmm + ":" + ss;

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

    //if (localStorage.getItem($scope.TOKEN_KEY)) {
    //    $rootScope.connected = true;
    //    //$scope.$apply();
    //    $rootScope.username = localStorage.getItem($scope.USERNAME_KEY);
    //    AuthService.setLoggedInUser(localStorage.getItem($scope.USERNAME_KEY));
    //}
    //else {
    //    $rootScope.connected = false;
    //    //$scope.$apply();
    //}

    $scope.FetchTravels = function () {
        //verifyLogIn();

        //if(AuthService.getLoggedInUser() === "")
        //{
        //    alert("Vous devez d'abord vous connecter.");
        //    return;
        //}
        $.ajax({
            type: 'GET',
            url: $scope.baseURLTravels + "?username=" + IdentityService.getCurrentUserName()
        }).fail(function (error) {
            MsgFlashService.setErrorMessage("Une erreur est survenue lors de la recuperation : " + error.responseText);
            $scope.flashErrors = MsgFlashService.getErrorMessage();
            $scope.showAlertError = MsgFlashService.showErrorMessage;
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
            $scope.flashMessage = MsgFlashService.getMessage();
            $scope.showAlertError = MsgFlashService.showErrorMessage;
            $scope.showAlertSucess = MsgFlashService.showMessage;
            $rootScope.showTravels = true;
            $scope.$apply();
        });
    }

    $scope.CreateTravel = function () {
        //verifyLogIn();

        //if (AuthService.getLoggedInUser() === "") {
        //    alert("Vous devez d'abord vous connecter.");
        //    return;
        //}

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

            if ($scope.dateStartIsGood)
            {
                if($scope.dateEndIsGood)
                {
                    // ALL GOOD
                }
                else
                {
                    MsgFlashService.setErrorMessage("Erreur: Vous devez choisir des dates valides!");
                    $scope.flashErrors = MsgFlashService.getErrorMessage();
                    $scope.showAlertError = MsgFlashService.showErrorMessage;
                    $scope.showAlertSucess = MsgFlashService.showMessage;
                }
            }
            else
            {
                MsgFlashService.setErrorMessage("Erreur: Vous devez choisir des dates valides!");
                $scope.flashErrors = MsgFlashService.getErrorMessage();
                $scope.showAlertError = MsgFlashService.showErrorMessage;
                $scope.showAlertSucess = MsgFlashService.showMessage;
            }
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
                username: IdentityService.getCurrentUserName()
            }

        }).fail(function (error) {
            //$scope.errorHappened = true;
            MsgFlashService.setErrorMessage("Une erreur est survenue lors de la création : " + error.responseText);
            $scope.flashErrors = MsgFlashService.getErrorMessage();
            $scope.showAlertError = MsgFlashService.showErrorMessage;
            $scope.showAlertSucess = MsgFlashService.showMessage;
            $scope.$apply();
        }).success(function (data) {
            console.log(data);

            $scope.FetchTravels();
            $scope.traveltitle = "";
            $scope.datebegin = null;
            $scope.dateend = null;
            $scope.budget = 1;
            $scope.showByDates = false;
            $scope.showByDays = false;

            MsgFlashService.setErrorMessage("");
            MsgFlashService.setMessage("Succes!");
            $scope.flashMessage = MsgFlashService.getMessage();
            $scope.showAlertError = MsgFlashService.showErrorMessage;
            $scope.showAlertSucess = MsgFlashService.showMessage;
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

    $scope.goEditTravel = function(id)
    {
        var stringifiedId = "" + id;
        DataTransfer.object = id;

        $location.path("/travelsedit");
    }

    //function verifyLogIn() {
    //    if (localStorage.getItem($scope.TOKEN_KEY)) {
    //        $rootScope.connected = true;
    //        //$scope.$apply();
    //        $rootScope.username = localStorage.getItem($scope.USERNAME_KEY);
    //        AuthService.setLoggedInUser(localStorage.getItem($scope.USERNAME_KEY));
    //    }
    //    else {
    //        $rootScope.connected = false;
    //        //$scope.$apply();
    //    }
    //}
}

