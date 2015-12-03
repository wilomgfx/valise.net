angular
    .module('AppAirBermudes.Users', ['ngRoute'])
    .controller('UsersController', UsersController);

function UsersController($scope, $rootScope, $http, $route, $sce, UserService, $location, AuthService) {
    $scope.usernamereg = "";
    $scope.passreg = "";
    $scope.confirmpassreg = "";

    $rootScope.username = "";
    $scope.usernamelocal = "";
    $scope.pass = "";

    $scope.error = "";
    $scope.errorShow = false;

    $scope.errorHappened = false;


    $scope.TOKEN_KEY = UserService.getTokenKey();
    $scope.USERNAME_KEY = UserService.getUsernameKey();
    //$scope.TOKEN_KEY = "MEMOSTOKEN";
    //$scope.USERNAME_KEY = "MEMOSUSERNAME";

    if (localStorage.getItem($scope.TOKEN_KEY))
    {
        $rootScope.connected = true;        
        //$scope.$apply();
        $rootScope.username = localStorage.getItem($scope.USERNAME_KEY);
        AuthService.setLoggedInUser(localStorage.getItem($scope.USERNAME_KEY));
    }
    else
    {
        $rootScope.connected = false;
        //$scope.$apply();
    }

    $scope.Login = function()
    {
        $rootScope.username = $scope.usernamelocal;
        if ($rootScope.username === "")
        {
            $scope.error = "Veuillez entrez un nom d'utilisateur."
            $scope.errorShow = true;
            return;
        }
        if ($scope.pass === "")
        {
            $scope.error = "Veuillez entrez un mot de passe."
            $scope.errorShow = true;
            return;
        }
        //$scope.test = function () { };

        $scope.loginAjax($rootScope.username, $scope.pass);

        //var myDataPromise = $scope.loginWithCallback($scope.username, $scope.pass);
        //myDataPromise.then(function (result) {  // this is only run after $http completes
        //    if($scope.errorHappened = true)
        //    {
        //        $scope.error = "Une erreur est survenue lors de l'identification."
        //        $scope.errorShow = true;
        //    }
        //    else
        //    {
        //        $scope.errorShow = false;
        //        $scope.error = "";
        //        $scope.connected = true;
        //    }
        //});

        //$scope.loginAjax($scope.username, $scope.pass, $scope.test);

    }

    $scope.Logout = function()
    {
        if ($rootScope.connected != true)
            return;

        $scope.logoutAjax();

        $rootScope.connected = false;
    }

    $scope.Register = function()
    {
        if ($scope.usernamereg === "") {
            $scope.error = "Veuillez entrez un nom d'utilisateur."
            $scope.errorShow = true;
            return;
        }
        if ($scope.passreg === "") {
            $scope.error = "Veuillez entrez un mot de passe."
            $scope.errorShow = true;
            return;
        }
        if ($scope.confirmpassreg !== $scope.passreg) {
            $scope.error = "La confirmation de mot de passe diffère du mot de passe choisit."
            $scope.errorShow = true;
            return;
        }

        $scope.registerAjax($scope.usernamereg, $scope.passreg, $scope.confirmpassreg);

        //var myDataPromise = $scope.registerAjax($scope.usernamereg, $scope.passreg, $scope.confirmpassreg);
        //myDataPromise.then(function (result) {  // this is only run after $http completes
        //    $scope.loginAjax($scope.usernamereg, $scope.passreg);
        //});       
    }
    $scope.registerAjax = function (email, pass, conpass) {
        $.ajax({
            type: 'POST',
            url: "http://localhost:53762/api/Account/Register",
            data:
            {
                Email: email,
                Password: pass,
                ConfirmPassword: conpass
            }

        }).fail(function (error) {
            //$scope.errorHappened = true;
            $scope.error = "Une erreur est survenue lors de l'inscription : " + error.responseText;
            $scope.errorShow = true;
            $scope.$apply();
        }).success(function (data) {
            console.log(data);
            localStorage.setItem($scope.TOKEN_KEY, data.access_token);
            localStorage.setItem($scope.USERNAME_KEY, data.userName);

            $scope.loginAjax(email, pass);
            $scope.error = "";
            $scope.errorShow = false;
            $rootScope.connected = true;
            $scope.$apply();

            alert("Vous êtes maintenant inscrit. Bienvenue!");
            //$scope.errorHappened = false;
        });
    }

    //$scope.registerWithCallback = function (email, pass, conpass)
    //{

    //    return
    //    $http({
    //        method: 'POST',
    //        url: "https://localhost:44302/api/Account/Register",
    //        data:
    //        {
    //            Email: email,
    //            Password: pass,
    //            ConfirmPassword: conpass
    //        }

    //    }).then(function (data) {
    //        console.log(data);
    //    });
    //}

    $scope.loginAjax = function (user, pass) {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:53762/Token',
            data: {
                grant_type: 'password',
                username: user,
                password: pass
            }
        }).fail(function (error) {
            //$scope.errorHappened = true;
            $scope.error = "Une erreur est survenue lors de l'identification : " +error.responseText;
            $scope.errorShow = true;
            $scope.$apply();
        }).success(function (data) {
            console.log(data);
            localStorage.setItem($scope.TOKEN_KEY, data.access_token);
            localStorage.setItem($scope.USERNAME_KEY, data.userName);
            $rootScope.username = data.userName;

            alert("Vous êtes maintenant connecté.");

            $scope.error = "";
            $scope.errorShow = false;
            $rootScope.connected = true;
            AuthService.setLoggedInUser(localStorage.getItem($scope.USERNAME_KEY));
            $scope.$apply();


            //$scope.errorHappened = false;
        });
    }

    //$scope.loginWithCallback = function (email, pass, conpass) {

    //    return
    //    $.ajax({
    //        type: 'POST',
    //        url: 'https://localhost:44302/Token',
    //        data: {
    //            grant_type: 'password',
    //            username: user,
    //            password: pass
    //        }
    //    }).fail(function (error) {
    //        $scope.errorHappened = true;

    //    }).success(function (data) {
    //        console.log(data);
    //        localStorage.setItem($scope.TOKEN_KEY, data.access_token);

    //        $scope.errorHappened = false;
    //    }).then(function (data) {
    //        console.log(data);
    //    });
    //}
    //$scope.loginAjax = function (user, pass, methode) {
    //    $.ajax({
    //        type: 'POST',
    //        url: 'https://localhost:44302/Token',
    //        data: {
    //            grant_type: 'password',
    //            username: user,
    //            password: pass
    //        }
    //    }).fail(function (error) {

    //    }).success(function (data) {
    //        console.log(data);
    //        localStorage.setItem($scope.TOKEN_KEY, data.access_token);
    //        methode();
    //    });
    //}
    $rootScope.logoutAjax = function () {
        localStorage.removeItem($scope.TOKEN_KEY);
        localStorage.removeItem($scope.USERNAME_KEY);
        AuthService.setLoggedInUser("");
        alert("Vous êtes maintenant déconnecté.");
    }
    $scope.callAjax = function () {
        var token = localStorage.getItem($scope.TOKEN_KEY);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        $.ajax({
            type: 'GET',
            url: 'http://localhost:53762/api/values',
            headers: headers
        }).success(function (data) {
            console.log(data);
            $scope.$apply();
        });
    }

    $scope.RedirectToRegister = function()
    {
        $location.path("/register");
    }

    $scope.RedirectToLogin = function()
    {
        $location.path("/index");
    }
    $scope.RedirectToTravels = function () {
        $location.path("/travels");
    }

    $scope.RedirectToChat = function () {
        $location.path("/chat");
    }
}