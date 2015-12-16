
angular.module('AppAirBermudes.mapService', ['ngRoute'])
.service('MapService', MapService)
.directive('suggestionMarkerPopup', SuggestionMarkerPopup)
.directive('courseMarkerPopup', CourseMarkerPopup)


.controller('TestPlacesController', TestPlacesController)
;

function TestPlacesController($scope, MapService) {

    var placesS = MapService;

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: { lat: 45.501459, lng: -73.567543 },
    });

    var settings = {
        location: { lat: 45.501459, lng: -73.567543 },
        radius: '20000',
        types: ['restaurant', 'lodging', 'amusement_park', 'park', 'aquarium', 'casino', 'museum']
    };

    var courcesInfo = [
        {
            "startingPoint": {
                "latitude": 37.772323,
                "longitude": -122.214897
            },
            "arrivalPoint": {
                "latitude": 21.291982,
                "longitude": -157.821856
            },
            "transportType": "train",
            "transporter": "Via Rail Canada"
        },
        {
            "startingPoint": {
                "latitude": 21.291982,
                "longitude": -157.821856
            },
            "arrivalPoint": {
                "latitude": -18.142599,
                "longitude": 178.431
            },
            "transportType": "Bull",
            "transporter": "Rent a bull India"
        },
        {
            "startingPoint": {
                "latitude": -18.142599,
                "longitude": 178.431
            },
            "arrivalPoint": {
                "latitude": -27.46758,
                "longitude": 153.027892
            },
            "transportType": "Canoe",
            "transporter": "Hawaii canoe"
        }
    ];


    placesS.showSuggestions($scope, map, settings, 99);

    placesS.showCourses($scope, map, courcesInfo);

};


function MapService($compile) {

    var service = this;

    /*
        Show somme suggestions as markers on the specified map and set a popup window on each marker.
        
        Parametters :
        - scope The current scope.
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

        if (!scope) return;
        if (!map) return;
        if (!settings) return;
        if (maxResult <= 0) return;

        var gPlacesService = new google.maps.places.PlacesService(map);

        gPlacesService.nearbySearch(settings, function (results, status) {

            if (status == google.maps.places.PlacesServiceStatus.OK) {

                var infoWindow = new google.maps.InfoWindow();
                var bounds = new google.maps.LatLngBounds();

                for (i = 0; i < maxResult; i++) {

                    //bounds.extend(results[i].geometry.location);

                    var marker = new google.maps.Marker({
                        position: results[i].geometry.location,
                        map: map,
                        icon: results[i].icon
                    });

                    var content = '<suggestion-marker-popup'
                    + ' name="' + results[i].name + '"'
                    + ' address="' + results[i].vicinity + '"'
                    //+ ' address="' + results[i].formatted_address + '"'  /* L'adresse formatée ne fonctionne pas */
                    + ' ></suggestion-marker-popup>';

                    google.maps.event.addListener(marker, 'click', markerOnCLickListener(marker, content, infoWindow, map, scope));

                    //map.fitBounds(bounds);
                }
            }
        });
    };

    /*
        Trace the courses on the specified map. Also, place some markers with popup on each 
        course starting marker.

        Parametters :
        - scope The current scope.
        - map The specified map object.
        - settings A jsObject contaning the required settings.
        - courcesInfo A jsObject contaning the required information described below.

        courcesInfo : [
    
            {
                startingPoint : {
                    latitude: 37.772323,
                    longitude: -122.214897
                },
                arrivalPoint : {
                    latitude: 21.291982,
                    longitude: -157.821856
                },
                transportType: train,
                transporter: Via Rail Canada
            },
            {
                startingPoint : {
                    latitude: 21.291982,
                    longitude: -157.821856
                },
                arrivalPoint : {
                    latitude: -18.142599,
                    longitude: 178.431
                },
                transportType: Bull,
                transporter: Rent a bull India
            }
        ]

    */
    this.showCourses = function (scope, map, courcesInfo) {

        if (!scope) return;
        if (!map) return;
        if (!courcesInfo) return;

        var routesCoordinates = [];
        var infoWindow = new google.maps.InfoWindow();

        for (i = 0; i < courcesInfo.length; i++) {

            var routeInfo = courcesInfo[i];

            var startingPoint = new google.maps.LatLng(
                routeInfo.startingPoint.latitude,
                routeInfo.startingPoint.longitude
                );

            var arrivalPoint = new google.maps.LatLng(
                routeInfo.arrivalPoint.latitude,
                routeInfo.arrivalPoint.longitude
                );

            if ($.inArray(startingPoint, routesCoordinates) == -1) {

                routesCoordinates.push(startingPoint);


                var marker = new google.maps.Marker({
                    position: startingPoint,
                    map: map
                });

                var content = '<course-marker-popup'
                + ' transporter="' + routeInfo.transporter + '"'
                + ' transporttype="' + routeInfo.transportType + '"'
                + ' ></course-marker-popup>';

                google.maps.event.addListener(marker, 'click', markerOnCLickListener(marker, content, infoWindow, map, scope));

            }

            routesCoordinates.push(arrivalPoint);
        }

        var lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 4,
        };

        var routes = new google.maps.Polyline({
            path: routesCoordinates,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            icons: [
                {
                    icon: lineSymbol,
                    offset: '0%',
                    repeat: '25%'
                }
            ],
        });

        routes.setMap(map);
    };

    function markerOnCLickListener(marker, content, infoWindow, map, scope) {

        return function () {

            var compiled = $compile(content)(scope);

            infoWindow.setContent(compiled[0]);
            infoWindow.open(map, marker);
        };
    };

};

function SuggestionMarkerPopup() {

    return {

        restrict: "E",
        templateUrl: "mapService/suggestionMarkerPopup.html",
        scope: {
            name: '@name',
            address: '@address'
        },
        controller: function ($scope) {

            $scope.addToDestinations = function (callback) {

                if (callback) {
                    callback(/* name + address */);
                }

                alert("Not implemented !!!");
            }

        }

    };
};


function CourseMarkerPopup() {

    return {

        restrict: "E",
        templateUrl: "mapService/courseMarkerPopup.html",
        scope: {
            transporter: '@transporter',
            transportType: '@transporttype'
        },
        controller: function ($scope) {

        }

    };
};