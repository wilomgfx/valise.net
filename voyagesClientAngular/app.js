angular.module('name of app', [
    'ngRoute', //module
])
.config(['$routeProvider', function ($routeProvider) {

    //$routeProvider.when('/login', {
    //    templateUrl: '/users/login.html',
    //    controller: 'ClientController'
    //});
    //$routeProvider.when('/signup', {
    //    templateUrl: '/users/signup.html',
    //    controller: 'ClientController'
    //});
    //$routeProvider.when('/', {ss
    //    templateUrl: '/users/user.html',
    //    controller: 'ClientController'
    //});

    //$routeProvider.otherwise({ redirectTo: '/index' });
}])

//angular.module('AuthService', [])
//.service('Auth', function () {

//    this.loggedInUser = "";
//    this.isLoggedIn = false;

//    this.setLoggedInUser = function (user) {
//        this.loggedInUser = user;
//        this.isLoggedIn = true;
//        //console.log(user + "logged user : " + this.loggedInUser);
//    }
//    this.getLoggedInUser = function () {
//        //console.log("logged user : " + this.loggedInUser);
//        return this.loggedInUser;
//    }

//})