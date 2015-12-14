angular.module('AppAirBermudes.account', ['ngRoute'])
.controller('AccountController', AccountController)
.service('AccountService', AccountService)
.service('IdentityService', IdentityService)
;

function AccountController($scope, $location, AccountService, IdentityService) {

    var accountS = AccountService;
    var identityS = IdentityService;

    $scope.email = "";
    $scope.password = "";
    $scope.confirmPassword = "";

    $scope.errorMessage = "";

    $scope.signup = function () {

        accountS.signup($scope.email, $scope.password, $scope.confirmPassword,

            // success
            function (data) {

                console.log(data);

                $scope.errorMessage = "";
                $scope.$apply();

                $scope.login(function () {

                    $scope.email = "";
                    $scope.password = "";
                    $scope.confirmPassword = "";

                    $scope.$apply(function () {
                        $location.path("/travels");
                    });
                });

            },

            // error
            function (error) {

                console.log(error);

                var modelState = $.parseJSON(error.responseText).ModelState

                if (modelState) {

                    // Too short password
                    var modelStateTooShortPassword = modelState["model.Password"];
                    // Not secure passw0rd
                    var modelStateNotSecurePass = modelState[""];

                    // Too short password
                    if (modelStateTooShortPassword) {
                        var tooShortPassMess = modelStateTooShortPassword[0];
                        if (tooShortPassMess) {
                            $scope.errorMessage = tooShortPassMess;
                        }
                    }
                        // Not secure passw0rd
                    else if (modelStateNotSecurePass) {
                        var modelStateNotSecurePassMsg = modelState[""][0];
                        if (modelStateNotSecurePassMsg) {
                            $scope.errorMessage = modelStateNotSecurePassMsg
                        }
                    }

                    // Bad confirm password
                    var modelStateConfirmPassword = modelState["model.ConfirmPassword"];
                    if (modelStateConfirmPassword) {
                        var badConfirmPassMsg = modelStateConfirmPassword[0];
                        if (badConfirmPassMsg) {
                            $scope.errorMessage = badConfirmPassMsg;
                        }
                    }
                }

                $scope.$apply();
            });
    };

    $scope.login = function (callback) {

        accountS.login($scope.email, $scope.password,

            // success
            function (data) {
                $scope.errorMessage = "";
                $scope.$apply();

                identityS.setToken(data.access_token);

                $scope.email = "";
                $scope.password = "";
                $scope.confirmPassword = "";

                $scope.$apply(function () {
                    $location.path("/travels");
                });

                if (callback) {
                    callback();
                }
            },

            // error
            function (error) {

                $scope.errorMessage = $.parseJSON(error.responseText).error_description;
                $scope.$apply();
            });
    };

    /* TODO: SUPPRESS THIS FUNCTION before any releasse */
    $scope.devSignin = function () {
        $scope.email = "test@test.test";
        $scope.password = "Passw0rd/";
        $scope.login();
    }

};

function AccountService(IdentityService) {

    var service = this;
    var identityS = IdentityService;

    service.signup = function (email, password, confirmPassword, successCallback, errorCallback) {

        $('#loading').show("slide");

        setTimeout(function () {

            $.ajax({
                method: 'POST',
                url: "http://localhost:53762/api/Account/Register",
                data:
                {
                    Email: email,
                    Password: password,
                    ConfirmPassword: confirmPassword
                }
            })
            .success(function (data) {

                if (successCallback) {
                    $('#loading').hide();
                    successCallback(data);
                }
            })
            .error(function (error) {

                if (errorCallback) {

                    $('#loading').hide();
                    errorCallback(error);
                }
            });

        }, 1 * 1000);

    };

    service.login = function (email, password, successCallback, errorCallback) {

        $('#loading').show("slide");

        setTimeout(function () {

            $.ajax({
                type: 'POST',
                url: 'http://localhost:53762/Token',
                data: {
                    grant_type: 'password',
                    username: email,
                    password: password
                }
            })
            .success(function (data) {

                if (successCallback) {

                    $('#loading').hide();
                    identityS.setCurrentUserName(email);
                    successCallback(data);
                }
            })
            .error(function (error) {

                if (errorCallback) {

                    $('#loading').hide();
                    errorCallback(error);
                }
            });

        }, 1 * 1000);
    };

    return service;
};

function IdentityService() {

    var service = this;

    var TOKEN_KEY = "TOKEN";
    var USERNAME_KEY = "USERNAME";

    service.setToken = function (token) {

        localStorage.setItem(TOKEN_KEY, token);
    };

    service.getToken = function () {

        return localStorage.getItem(TOKEN_KEY);
    };

    service.removeToken = function () {

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERNAME_KEY);
    };

    service.setCurrentUserName = function (newUserName) {
        localStorage.setItem(USERNAME_KEY, newUserName);
    };

    service.getCurrentUserName = function () {
        return localStorage.getItem(USERNAME_KEY);
    };

    service.isAuthenticated = function () {

        if (localStorage.getItem(TOKEN_KEY) != null) {
            return true;
        }

        return false;
    };

    return service;
};