
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
                startingAddress: "3800 Chemin Queen Mary, Montréal, QC H3V 1H6",
                arrivalAddress: "200 McIntyre St E, North Bay, ON P1B 8V6",
                transportType: "train",
                transporter: "Via Rail Canada"
            },
            {
                startingAddress: "200 McIntyre St E, North Bay, ON P1B 8V6",
                arrivalAddress: "Le Domaine, Parc-de-la-Verendrye, QC J0W 1E0",
                transportType: "Other",
                transporter: "Other trans-canadian services"
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
    service.showSuggestions = function (scope, map, settings, maxResult) {

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

                    bounds.extend(results[i].geometry.location);

                    var image = {
                        url: results[i].icon,
                        size: google.maps.Point(71, 71),
                        origin: google.maps.Point(0, 0),
                        anchor: google.maps.Point(0, 0),
                        scaledSize: new google.maps.Size(20, 20)
                    };

                    var marker = new google.maps.Marker({
                        position: results[i].geometry.location,
                        map: map,
                        icon: image
                    });

                    var type = (results[i].types != null && results[i].types.length > 0) ? results[i].types[0] : 'other';

                    var content = '<suggestion-marker-popup'
                    + ' name="' + results[i].name + '"'
                    + ' address="' + results[i].vicinity + '"'
                    + ' type="' + type   + '"'
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
        - courcesInfo A jsObject contaning the required information described below.

        courcesInfo : [

            {
                startingAddress: "3800 Chemin Queen Mary, Montréal, QC H3V 1H6",
                arrivalAddress: "200 McIntyre St E, North Bay, ON P1B 8V6",
                transportType: train,
                transporter: Via Rail Canada
            },
            {
                . . . 
            }
        ]

    */
    service.showCourses = function (scope, map, coursesInfo) {

        if (!scope) return;
        if (!map) return;
        if (!coursesInfo) return;

        var infoWindow = new google.maps.InfoWindow();

        var lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 4,
        };

        var icons = [
            {
                icon: lineSymbol,
                offset: '100%'
            }
        ];

        function asyncLoop(i) {

            var courseAddresses = [coursesInfo[i].startingAddress, coursesInfo[i].arrivalAddress];

            getLatLngListFromAddresses(courseAddresses, function (cords) {

                var routes = new google.maps.Polyline({
                    path: cords,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    icons: icons
                });

                routes.setMap(map);

                var marker = new google.maps.Marker({
                    position: cords[0],
                    map: map
                });

                console.log(coursesInfo[i]);

                var content = '<course-marker-popup'
                + ' transporter="' + coursesInfo[i].transporter + '"'
                + ' transporttype="' + coursesInfo[i].transportType + '"'
                + ' address="' + coursesInfo[i].startingAddress + '"'
                + ' id="' + coursesInfo[i].id + '"'
                /*
                + ' startDate="' + coursesInfo[i].startDate + '"'
                + ' endDate="' + coursesInfo[i].endDate + '"'
                */
                + ' ></course-marker-popup>';

                google.maps.event.addListener(marker, 'click', markerOnCLickListener(marker, content, infoWindow, map, scope));

                if (i < coursesInfo.length - 1) {
                    asyncLoop(i += 1);
                }
            });
        };

        asyncLoop(0);
    };

    service.showDestinations = function (scope, map, destinations) {
        // Do nothing
    };

    service.geocodeAddress = function (address, callback) {

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': address }, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {


                if (callback) {
                    callback(results[0].geometry.location);
                }
            }
            else {
                return null;
            }
        });
    };

    function getLatLngListFromAddresses(AddressesList, callback) {

        var result = [];
        
        function asyncLoop(i) {

            var address = AddressesList[i];

            service.geocodeAddress(address, function (data) {

                if (data != null) {
                    result.push(data);
                }

                if (i == AddressesList.length - 1 && callback) {
                    callback(result);
                }
                else {
                    asyncLoop(i += 1);
                }
            });
        };

        asyncLoop(0);
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
            address: '@address',
            type: '@type'
        },
        controller: function ($scope) {
            
            $scope.addSuggestion = function () {
                $scope.$parent.addSuggestion($scope.type, $scope.name, $scope.address);
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
            transporttype: '@transporttype',
            address: '@address',
            id: '@id'
            /*
            ,
            startDate: '=startDate',
            endDate: '=endDate'
            */
        },
        controller: function ($scope, $location) {

            $scope.edit = function () {
                $location.path("/courses/edit/" + $scope.id);
            };

        }

    };
};