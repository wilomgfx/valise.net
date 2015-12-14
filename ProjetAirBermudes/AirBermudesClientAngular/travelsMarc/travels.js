angular.module('AppAirBermudes.travelsMarc', [])
.controller('TravelsMarcController', TravelsController)
.service('TravelsService', TravelsService)
.directive('travelMinDetails', TravelMinDetailsDirective)
;


function TravelsController($scope, TravelsService, IdentityService) {

    var travelsS = TravelsService;
    $scope.Travels = [];

    /*
        Get the latest travels, associated with the current user, from the API.
    */
    this.getLatestTravels = function () {

        travelsS.getLatestTravels(
            function (data) {

                $scope.Travels = data;
                $scope.$apply();
            },
            function (error) {
                console.log(error);
            }
        );
    };

    this.getLatestTravels();
};


function TravelsService(IdentityService) {

    var service = this;

    var identityS = IdentityService;
    var token = identityS.getToken();

    /*
        Get the latest travels, associated with the current user, from the API.
    */
    service.getLatestTravels = function (successCallback, errorCallback) {

        $.ajax({
            type: 'GET',
            url: 'http://localhost:53762/api/Travels',
            headers: { Authorization: 'Bearer ' + token },
            data: {
                grant_type: 'password',
            }
        })
        .success(function (data) {

            if (successCallback) {
                successCallback(data);
            }
        })
        .error(function (error) {

            if (errorCallback) {
                errorCallback(error);
            }
        });

    };



    service.getLatestTravels();

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
