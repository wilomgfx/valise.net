angular
    .module('AppAirBermudes.travelsOldEdit', ['ui.bootstrap.datetimepicker'])
    .controller('TravelsOldEditController', TravelsEditController);

function TravelsEditController($scope, $rootScope, $http, $route, $sce, $location, IdentityService, MsgFlashService, DataTransfer) {

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
        var formatted = mm + '/' + dd + '/' + yyyy + " " + hh + ":" + mmm + ":" + ss;

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

    $scope.fetchTravel = function (id) {
        // Ensures this is an int.
        var stringified = id + "";
        var realId = parseInt(stringified);

        $.ajax({
            type: 'GET',
            url: $scope.baseURLTravels + realId
        }).fail(function (error) {
            //$scope.errorHappened = true;
            MsgFlashService.setErrorMessage("Une erreur est survenue lors de la récupération du voyage : " + error.responseText);
            $scope.flashErrors = MsgFlashService.getErrorMessage();
            $scope.showAlertError = MsgFlashService.showErrorMessage;
            $scope.showAlertSucess = MsgFlashService.showMessage;
            $scope.$apply();
        }).success(function (data) {
            console.log(data);

            $scope.travel = data;

            MsgFlashService.setErrorMessage("");
            MsgFlashService.setMessage("Succes!");
            $scope.flashMessage = MsgFlashService.getMessage();
            $scope.showAlertError = MsgFlashService.showErrorMessage;
            $scope.showAlertSucess = MsgFlashService.showMessage;


            var fetched = $scope.travel;
            $scope.traveltitle = fetched.TravelId;
            $scope.budget = fetched.Budget;
            $scope.datebegin = fetched.DateBegin;
            $scope.dateend = fetched.DateEnd;

            $scope.$apply();

        });
    }

    $scope.fetchTravel(DataTransfer.getObject());

}