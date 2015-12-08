angular.module('AppAirBermudes.header', [])
.controller('HeaderController', HeaderController)
.directive('header', Header)
;


function HeaderController($scope, $http, IdentityService, $location) {

    var identityS = IdentityService;

    $scope.isAuthenticated = function () {
        return identityS.isAuthenticated();
    };

    $scope.loginLogout = function () {

        identityS.removeToken();
        $location.path("/account/login");
    }

    $scope.getCurrentUserName = function () {

        return identityS.getCurrentUserName();
    };

};

function Header () {

    return {

        restrict: "E",
        templateUrl: "header/header.html",
        controller: 'HeaderController'
    };
};