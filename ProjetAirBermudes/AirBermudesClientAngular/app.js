angular.module('AppAirBermudes', [
    'ngRoute',
    'AppAirBermudes.users',
    'AppAirBermudes.MessageFlashingService',
    'AppAirBermudes.AuthentificationService',
    //'AppAirBermudes.RouteAutorization',
    'AppAirBermudes.courses'
])
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/login', {
        templateUrl: '/users/login.html',
        controller: 'ClientController'
    });
    $routeProvider.when('/signup', {
        templateUrl: '/users/signup.html',
        controller: 'ClientController'
    });
    //$routeProvider.when('/', {
    //    templateUrl: '/users/user.html',
    //    controller: 'ClientController'
    //});
    $routeProvider.when('/courses', {
        templateUrl: '/courses/courses.html',
        controller: 'CourseController'
    });
    //$routeProvider.when('/addMemo', {
    //    templateUrl: '/memos/addMemo.html',
    //    controller: 'MemoController'
    //});

    /*
        When the login will be implemented, add this attribute to all route with the right value.
        The RouteAutorization module must be uncommented

        access: {
            requireAuthentication: true
        }

    */

    $routeProvider.otherwise({ redirectTo: '/index' });
}])

//service for authentification, find out the current logged in user and if the user is logged in
angular.module('AppAirBermudes.AuthentificationService', [])
.service('AuthService', function () {

    this.loggedInUser = "";
    this.isLoggedIn = false;

    this.setLoggedInUser = function (user) {
        this.loggedInUser = user;
        this.isLoggedIn = true;
    }
    this.getLoggedInUser = function () {
        return this.loggedInUser;
    }

})


// Route change listener to validate if the user is authenticated and can acces the next route.
/*
angular.module('AppAirBermudes.RouteAutorization', [])
.run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {

    var authS = AuthService;

    $rootScope.$on('$routeChangeStart', function (event, next) {

        if (next.access) {

            if (next.access.requireAuthentication && !authS.isLoggedIn) {

                $location.path("/login");
            }
        }
    });

}])
*/

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