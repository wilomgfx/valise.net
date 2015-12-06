
angular.module('AppAirBermudes.places', ['ngRoute'])
.service('PlacesService', PlacesService)
.directive('markerPopup', MarkerPopup)


.controller('TestPlacesController', TestPlacesController)
;

function TestPlacesController($scope, PlacesService) {

    var placesS = PlacesService;

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: 45.501459, lng: -73.567543 },
    });

    var settings = {
        location: { lat: 45.501459, lng: -73.567543 },
        radius: '20000',
        types: ['restaurant', 'lodging', 'amusement_park', 'park', 'aquarium', 'casino', 'museum']
    };

    placesS.showSuggestions($scope, map, settings, 99);

};


function PlacesService($compile) {

    var service = this;

    /*
        Show somme suggestions on the specified map.
        
        Parametters :
        - map The specified map object.
        - settings A jsObject contaning the required settings.
        - maxResult The maximum number of result.

        The settings object must follow this structure :

        {
            location: {
                lat: ,
                lng: 
            },
            radius: '2000',
            types: ['type', 'type']
        }

        For a list of valid types:
        https://developers.google.com/places/documentation/supported_types

        Types that should be used :

        Hotel:
            -lodging
        Restaurant:
            -restaurant
        Tourist attraction:
            -amusement_park
            -park
            -aquarium
            -casino
            -museum

        'restaurant', 'lodging', 'amusement_park', 'park', 'aquarium', 'casino', 'museum'
        
    */
    this.showSuggestions = function (scope, map, settings, maxResult) {

        if (!map || !settings) {
            return;
        }

        if (maxResult <= 0) {
            return;
        }

        var gPlacesService = new google.maps.places.PlacesService(map);

        gPlacesService.nearbySearch(settings, function (results, status) {

            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var markers = [];
                var infoWindow = new google.maps.InfoWindow();
                var bounds = new google.maps.LatLngBounds();

                for (i = 0; i < maxResult; i++) {

                    bounds.extend(results[i].geometry.location);

                    var marker = new google.maps.Marker({
                        position: results[i].geometry.location,
                        map: map,
                        icon: results[i].icon
                    });

                    markers.push(marker);
                    
                    var content = '<marker-popup'
                    + ' name="' + results[i].name + '"'
                    + ' address="' + results[i].vicinity + '"'
                    //+ ' address="' + results[i].formatted_address + '"'  /* L'adresse formatée ne fonctionne pas */
                    + ' ></marker-popup>';

                    google.maps.event.addListener(marker, 'click', markerOnCLickListener(marker, content, infoWindow, map, scope));

                    map.fitBounds(bounds);
                }
            }
        });
    };

    function markerOnCLickListener(marker, content, infoWindow, map, scope) {

        return function () {

            var compiled = $compile(content)(scope);

            infoWindow.setContent(compiled[0]);
            infoWindow.open(map, marker);
        };
    };

};

function MarkerPopup() {

    return {

        restrict: "E",
        templateUrl: "places/markerPopup.html",
        scope: {
            name: '@name',
            address: '@address'
        },
        controller: function ($scope) {

            $scope.showDetails = function () {

                alert("Not implemented !!!");
            };

            $scope.addToDestinations = function(){

                alert("Not implemented !!!");
            }

        }

    };
};