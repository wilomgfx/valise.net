angular.module('AppAirBermudes.travelsMarc', ['ui.bootstrap.datetimepicker'])
.controller('TravelsMarcController', TravelsController)
.service('TravelsService', TravelsService)
.directive('travelMinDetails', TravelMinDetailsDirective)
.directive('createTravel', CreateTravelDirective)
;


function TravelsController($scope, TravelsService, IdentityService) {

    $scope.travelsS = TravelsService;
    $scope.identityS = IdentityService;

    var token = $scope.identityS.getToken();

    $scope.Travels = [];

    $scope.travelsS.clearTravels();

    /*
        Get the latest travels, associated with the current user, from the API.
    */
    this.getLatestTravels = function () {

        $.ajax({
            type: 'GET',
            url: 'http://localhost:53762/api/Travels',
            headers: { Authorization: 'Bearer ' + token },
            data: {
                grant_type: 'password',
            }
        })
        .success(function (data) {

            for (var i = 0; i < data.length ; i++) {

                $scope.travelsS.addTravel(data[i]);
            }

            $scope.$apply();
        })
        .error(function (error) {

            console.log(error);
        });
    };

    $scope.$watch('travelsS.getTravels()', function (data) {

        $scope.Travels = data;
    });

    this.getLatestTravels();
};


function TravelsService() {

    var service = this;
    var travels = [];

    service.addTravel = function (travel) {
        travels.push(travel);
    };

    service.getTravels = function () {
        return travels;
    };

    service.getTravel = function (index) {
        return travels[index];
    };

    service.deleteTravel = function (index) {
        travels.splice(index, 1);
    }

    service.clearTravels = function () {
        travels = [];
    };

    return service;
};


function TravelMinDetailsDirective($timeout) {

    return {

        restrict: "E",
        scope: {
            travel: '=travel'
        },
        templateUrl: "travelsMarc/travelMinDetails.html",
        controller: function ($scope) {



        },
        link: function ($scope) {

            var mapContainer;

            $timeout(function () {

                mapContainer = document.getElementById('map' + $scope.travel.TravelId);

                var map = new google.maps.Map(mapContainer, {
                    zoom: 2,
                    center: { lat: 45.501459, lng: -73.567543 },
                });
            });


        }
    };

};


function CreateTravelDirective() {

    return {

        restrict: "E",
        templateUrl: "travelsMarc/createTravel.html",
        controller: CreateTravelDirectiveController
    };
};


function CreateTravelDirectiveController($scope, IdentityService, TravelsService, MsgFlashService, $timeout) {

    $scope.travelsS = TravelsService;
    $scope.identityS = IdentityService;
    var token = IdentityService.getToken();

    //messages from the msgservice
    $scope.flashMessage = MsgFlashService.getMessage();
    $scope.flashErrors = MsgFlashService.getErrorMessage();

    //show or not to show the messages
    $scope.showAlertSucess = MsgFlashService.showMessage;
    $scope.showAlertError = MsgFlashService.showErrorMessage;

    $scope.showByDates = false;
    $scope.showByDays = false;

    $scope.dateValues = [];
    $scope.baseURLTravels = "http://localhost:53762/api/Travels/";

    // Error messages
    $scope.generalErrorMessage = "";
    $scope.dateTakeOffDropDownInputErrorMessage = "";
    $scope.dateArrivalDropDownInputErrorMessage = "";
    $scope.nbDaysErrorMessage = "";
    $scope.titleErrorMessage = "";
    $scope.setDurationMethodErrorMessage = "";

    var isValid = true;

    $scope.SetChoiceByDays = function () {

        $scope.showByDates = false;

        if ($scope.data) {

            if ($scope.data.dateTakeOffDropDownInput) {
                $scope.data.dateTakeOffDropDownInput = null;
            }

            if ($scope.data.dateArrivaleDropDownInput) {
                $scope.data.dateArrivaleDropDownInput = null;
            }
        }

        $scope.dateTakeOffDropDownInputErrorMessage = "";
        $scope.dateArrivalDropDownInputErrorMessage = "";

        $scope.setDurationMethodErrorMessage = "";

        $scope.showByDays = true;
    };

    $scope.SetChoiceByDates = function () {

        $scope.showByDays = false;
        $scope.nbrofdays = undefined;

        $scope.nbDaysErrorMessage = "";

        $scope.setDurationMethodErrorMessage = "";

        $scope.showByDates = true;
    };

    $scope.closeModal = function () {

        $('#new-travel-modal').modal('hide');

        $scope.traveltitle = undefined;
        $scope.budget = undefined;
        $scope.nbrofdays = undefined;

        if ($scope.data) {

            if ($scope.data.dateTakeOffDropDownInput) {
                $scope.data.dateTakeOffDropDownInput = null;
            }

            if ($scope.data.dateArrivaleDropDownInput) {
                $scope.data.dateArrivaleDropDownInput = null;
            }
        }

        $scope.showByDates = false;
        $scope.showByDays = false;
    };

    $scope.CreateTravel = function () {

        isValid = true;

        var data = {
            Title: $scope.traveltitle,
            Budget: $scope.budget,
        }

        if ($scope.showByDays) {

            validateNbDays();
            hasNbDays();
        }
        else if ($scope.showByDates) {

            validateDateTakeOff();
            validateDateArrival();
            hasDateTakeOff();
            hasDateArrival();
        }
        else {
            $scope.setDurationMethodErrorMessage = "You must first choose the method used to specify the duration of the travel.";
            return
        }

        validateTitle();
        validateBudget();
        hasTitle();
        hasBudget();

        if (isValid) {

            var data = {
                Title: $scope.traveltitle,
                Budget: $scope.budget,
            }

            if ($scope.showByDays) {
                //data.
            }

            $.ajax({
                method: 'POST',
                url: $scope.baseURLTravels,
                headers: { Authorization: 'Bearer ' + token },
                data:
                {
                    DateBegin: $scope.datebegin,
                    DateEnd: $scope.dateend,
                }

            }).fail(function (error) {

                console.log(error);

                /*
                //$scope.errorHappened = true;
                MsgFlashService.setErrorMessage("Une erreur est survenue lors de la création : " + error.responseText);
                $scope.flashErrors = MsgFlashService.getErrorMessage();
                $scope.showAlertError = MsgFlashService.showErrorMessage;
                $scope.showAlertSucess = MsgFlashService.showMessage;
                */

                $scope.$apply();
            }).success(function (data) {

                // Puisque c'est un success, on ajoute le voyage dans la liste locale
                $scope.travelsS.addTravel(data);

                $scope.closeModal();
                $scope.$apply();
            });
        }
    };

    $scope.$watch('data.dateTakeOffDropDownInput', validateDateTakeOff);
    $scope.$watch('data.dateArrivaleDropDownInput', validateDateArrival);
    $scope.$watch('nbrofdays', validateNbDays);
    $scope.$watch('traveltitle', validateTitle);
    $scope.$watch('budget', validateBudget);

    function validateDateTakeOff() {

        if ($scope.data && $scope.data.dateTakeOffDropDownInput) {

            console.log(new Date($scope.data.dateTakeOffDropDownInput));

            var date = new Date($scope.data.dateTakeOffDropDownInput);

            if (date < new Date() && date != "Invalid Date") {

                $scope.dateTakeOffDropDownInputErrorMessage = "The take off date is in the past";
                isValid = false;
                return false;
            }
            else {
                $scope.dateTakeOffDropDownInputErrorMessage = "";

                if ($scope.data.dateArrivaleDropDownInput) {
                    validateDateArrival();
                }

                return true;
            }
        }
        isValid = false;
    };

    function validateDateArrival() {

        if ($scope.data && $scope.data.dateArrivaleDropDownInput) {

            if ($scope.data.dateTakeOffDropDownInput) {

                if (new Date($scope.data.dateArrivaleDropDownInput) < new Date($scope.data.dateTakeOffDropDownInput)) {

                    $scope.dateArrivalDropDownInputErrorMessage = "The arrival date is earlier than the take off date.";
                    isValid = false;
                    return false;
                }
                else {
                    $scope.dateArrivalDropDownInputErrorMessage = "";
                    return true;
                }
            }
            else {
                $scope.dateArrivalDropDownInputErrorMessage = "You must first set the take off date.";
                isValid = false;
                return false;
            }
        }
        isValid = false;
    };

    function validateNbDays() {

        if ($scope.nbrofdays != undefined && $scope.nbrofdays != null) {

            if ($scope.nbrofdays < 1) {
                $scope.nbDaysErrorMessage = "You can't go on a trip for 0 days; it must be at-least 1 day.";
                isValid = false;
                return false;
            }
            else {
                $scope.nbDaysErrorMessage = "";
                return true;
            }
        }
        isValid = false;
    };

    function validateTitle() {

        if ($scope.traveltitle) {
            $scope.titleErrorMessage = "";
            return true;
        }
        isValid = false;
    };

    function validateBudget() {

        if ($scope.budget && $scope.budget != undefined) {

            if ($scope.budget < 1) {
                $scope.budgetErrorMessage = "How can you go travelling if you don't have any money?";
                isValid = false;
                return false;
            }
            else {
                $scope.budgetErrorMessage = "";
                return false;
            }
        }
        isValid = false;
    };

    function hasDateTakeOff() {

        if ($scope.data && $scope.data.dateTakeOffDropDownInput) {
            return true;
        }
        else {
            $scope.dateTakeOffDropDownInputErrorMessage = "Required";
            isValid = false;
            return false;
        }
    };

    function hasDateArrival() {

        if ($scope.data && $scope.data.dateArrivaleDropDownInput) {
            return true;
        }
        else {
            $scope.dateArrivalDropDownInputErrorMessage = "Required";
            isValid = false;
            return false;
        }
    };

    function hasNbDays() {

        if ($scope.nbrofdays) {
            return true;
        }
        else {
            $scope.nbDaysErrorMessage = "Required";
            isValid = false;
            return false;
        }
    };

    function hasTitle() {

        if ($scope.traveltitle) {
            return true;
        }
        else {
            $scope.titleErrorMessage = "Required";
            isValid = false;
            return false;
        }
    };

    function hasBudget() {

        if ($scope.budget) {
            return true;
        }
        else {
            $scope.budgetErrorMessage = "Required";
            isValid = false;
            return false;
        }
    };

};