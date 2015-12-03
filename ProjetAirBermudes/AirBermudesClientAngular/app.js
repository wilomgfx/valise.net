angular.module('AppAirBermudes', [
    'ngRoute',
    'AppAirBermudes.Users',
    'AppAirBermudes.travels',
    'MessageFlashingService',
    'AuthentificationService',
    'Service'
])
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/index', {
        templateUrl: 'usersDEBUG/index.html',
        controller: 'UsersController'
    });
    $routeProvider.when('/login', {
        templateUrl: '/usersDEBUG/index.html',
        controller: 'UsersController'
    });
    $routeProvider.when('/signup', {
        templateUrl: '/usersDEBUG/register.html',
        controller: 'UsersController'
    });
    $routeProvider.when('/travels', {
        templateUrl: '/travels/home.html',
        controller: 'TravelsController'
    });
    //$routeProvider.when('/', {
    //    templateUrl: '/users/user.html',
    //    controller: 'ClientController'
    //});
    //$routeProvider.when('/memo', {
    //    templateUrl: '/memos/memo.html',
    //    controller: 'MemoController'
    //});
    //$routeProvider.when('/addMemo', {
    //    templateUrl: '/memos/addMemo.html',
    //    controller: 'MemoController'
    //});
    $routeProvider.otherwise({ redirectTo: '/index' });
}])

//service for authentification, find out the current logged in user and if the user is logged in
angular.module('AuthentificationService', [])
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

//created by William Cantin -Version 1.0
angular.module('MessageFlashingService', [])
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

angular.module('Service', [])
.service('UserService', function ($rootScope) {
    this.TOKEN_KEY = "BERMUDESTOKEN";
    this.USERNAME_KEY = "BERMUDESUSERNAME";

    this.getTokenKey = function () {
        return this.TOKEN_KEY;
    };

    this.getUsernameKey = function () {
        return this.USERNAME_KEY;
    };

    if (localStorage.getItem(this.TOKEN_KEY)) {
        $rootScope.connected = true;
        //$scope.$apply();
        $rootScope.username = localStorage.getItem(this.USERNAME_KEY);
    };

    this.logoutUser = function () {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USERNAME_KEY);
        alert("Vous êtes maintenant déconnecté.");
    }
})