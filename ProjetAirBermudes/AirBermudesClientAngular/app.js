angular.module('AppAirBermudes', [
    'ngRoute',
    'AppAirBermudes.account',
    'AppAirBermudes.MessageFlashingService',
    'AppAirBermudes.DataTransferingService',
    'AppAirBermudes.header',
    'AppAirBermudes.courses',
    'AppAirBermudes.travels',
    'AppAirBermudes.TravelsEdit',
    'AppAirBermudes.mapService',
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
        controller: 'DaysController',
         access: {
            requireAuthentication: true
        }
    });

    $routeProvider.when('/days/:action', {
        templateUrl: '/days/addDay.html',
        controller: 'DaysController',
         access: {
            requireAuthentication: true
        }
    });
    
    $routeProvider.when('/days/:action/:id', {
        templateUrl: '/days/editDay.html',
        controller: 'DaysController',
         access: {
            requireAuthentication: true
        }
    });
    
    $routeProvider.when('/travels', {
        templateUrl: '/travels/home.html',
        controller: 'TravelsController',
        access: {
            requireAuthentication: true
        }
    });

    $routeProvider.when('/travelsmarc', {
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
    $routeProvider.when('/addCourse', {
        templateUrl: '/courses/addCourse.html',
        controller: 'CourseController',
        access: {
            requireAuthentication: true
        }
    });
    $routeProvider.when('/editCourse', {
        templateUrl: '/courses/editCourse.html',
        controller: 'CourseController',
        access: {
            requireAuthentication: true
        }
    });

    $routeProvider.when('/travelsedit', {
        templateUrl: '/travels/edit.html',
        controller: 'TravelsEditController',
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
    //<div ng-show="showAlertSucess" class="alert alert-success alert-dismissible" role="alert"><p>{{flashMessage}}</p></div>
    //<div ng-show="showAlertError" class="alert alert-danger alert-dismissible" role="alert"><p>{{flashErrors}}</p></div>

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

angular.module('AppAirBermudes.DataTransferingService', [])
.service('DataTransfer', function ($timeout) {

    this.object = null;
    this.objectArray = [];

    this.getObject = function () {
        return this.object;
    }

    this.getObjectArray = function () {
        return this.objectArray;
    }

    this.setObject = function (pObj) {
        this.object = pObj;
    }

    this.setObjectArray = function (pObjAr) {
        this.objectArray = pObjAr;
    }

    this.pushIntoObjectArray = function(pObj)
    {
        this.objectArray.push(pObj);
    }

    this.clearObjectArray = function()
    {
        this.objectArray = [];
    }

    this.clearObject = function()
    {
        this.object = null;
    }

})
