﻿angular.module('AppAirBermudes', [
    'ngRoute',
    'AppAirBermudes.account',
    'AppAirBermudes.MessageFlashingService',
    'AppAirBermudes.mapService',
    'AppAirBermudes.header',
    'AppAirBermudes.courses',
    'AppAirBermudes.travels',
    'AppAirBermudes.travelsMarc',
    'AppAirBermudes.days',
    'AppAirBermudes.RouteAutorization'

    //'AppAirBermudes.AuthentificationService',
])
.config(['$routeProvider', function ($routeProvider) {


    $routeProvider.when('/login', {
        templateUrl: '/account/login.html',
        controller: 'AccountController',
        access: {
            requireAuthentication: false
        }
    });
    $routeProvider.when('/signup', {
        templateUrl: '/account/signup.html',
        controller: 'AccountController',
        access: {
            requireAuthentication: false
        }
    });

    $routeProvider.when('/days', {
        templateUrl: '/days/days.html',
        controller: 'DaysController'
    });

    $routeProvider.when('/travels', {
        templateUrl: '/travelsMarc/travels.html',
        controller: 'TravelsMarcController',
        access: {
            requireAuthentication: true
        }
    });

    $routeProvider.when('/courses', {
        templateUrl: '/courses/courses.html',
        controller: 'CourseController',
        access: {
            requireAuthentication: true
        }
    });

    // !!! Test page !!!
    $routeProvider.when('/testmaps', {
        templateUrl: '/mapService/testmaps.html',
        controller: 'TestPlacesController',
        access: {
            requireAuthentication: true
        }
    });

    $routeProvider.when('/travelsold', {
        templateUrl: '/travels/home.html',
        controller: 'TravelsController',
        access: {
            requireAuthentication: true
        }
    });

    //$routeProvider.otherwise({ redirectTo: '/index' });
    $routeProvider.otherwise({ redirectTo: '/login' });
}])

// Route change listener to validate if the user is authenticated and can acces the next route.
angular.module('AppAirBermudes.RouteAutorization', [])
.run(['$rootScope', '$location', 'IdentityService', function ($rootScope, $location, IdentityService) {

    var identityS = IdentityService;

    $rootScope.$on('$routeChangeStart', function (event, next) {

        if (next.access) {

            if (next.access.requireAuthentication && !identityS.isAuthenticated()) {

                $location.path("/login");
            }
        }
    });

}])

//created by William Cantin -Version 1.0
angular.module('AppAirBermudes.MessageFlashingService', [])
.service('MsgFlashService', function ($timeout) {

    //for this service to show messages include this in your html
    //<div ng-show="showAlertSucess" class="alert alert-success" role="alert"><p>{{flashMessage}}</p></div>
    //<div ng-show="showAlertError" class="alert alert-danger" role="alert"><p>{{flashErrors}}</p></div>

    this.message = "";
    this.errorMessage = "";

    //if the message has been set,will be true
    this.showMessage = false;
    this.showErrorMessage = false;

    this.getMessage = function () {
        return this.message;
    }

    this.getErrorMessage = function () {
        return this.errorMessage;
    }

    this.setMessage = function (pMessage) {
        this.showMessage = true;
        this.showErrorMessage = false;
        this.message = pMessage;
    }

    this.setErrorMessage = function (pErrorMessage) {
        this.showErrorMessage = true;
        this.showMessage = false;
        this.errorMessage = pErrorMessage;
    }

    this.hideMessages = function () {
        this.showMessage = false;
        this.showErrorMessage = false;
    }

})