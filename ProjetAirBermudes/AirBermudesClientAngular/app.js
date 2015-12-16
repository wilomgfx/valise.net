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
    'AppAirBermudes.destinations',
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
    $routeProvider.when('/destinations', {
        templateUrl: '/destinations/destinations.html',
        controller: 'DestinationsController',
        access: {
            requireAuthentication: true
        }
    });
    $routeProvider.when('/addDestination', {
        templateUrl: '/destinations/addDestination.html',
        controller: 'DestinationsController',
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

////////////////////////////////////////////////////////////////
// DATA SERVICE
////////////////////////////////////////////////////////////////
angular.module('AppAirBermudes.DataService', [])
.service('DataService', DataService);

function DataService(IdentityService) {
    // Add here all the fields to share data
    // between controllers and services

    // TRAVEL
    this.currerntTravel = {};

    //////////////////////////////////////////////////////////////////////////////////
    // BEGIN: MARC'S CODE, Copied by: Andres
     

     var identityS = IdentityService;
     var token = identityS.getToken();
    
     /*
         Get the latest travels, associated with the current user, from the API.
     */
     this.getLatestTravels = function (successCallback, errorCallback) {
    
         $.ajax({
             type: 'GET',
             url: 'http://localhost:53762/api/Travels',
             headers: { Authorization: 'Bearer ' + token },
             data: {
                 grant_type: 'password',
             }
         })
         .success(function (data) {
    
             if (successCallback) {
                 successCallback(data);
             }
         })
         .error(function (error) {
    
             if (errorCallback) {
                 errorCallback(error);
             }
         });
     };
    
    
     // Allows to calculate the total expenses of the current travel
     this.getTotalExpenses = function() {
         var totalExpenses = 0;
    
         if(this.currentTravel) {
             if(this.currentTravel.Courses) {
                 for(index = 0; index < this.currentTravel.Courses.length; index++) {
                     totalExpenses += this.currentTravel.Courses[index].Budget;
                 }
             }
    
             if(this.currentTravel.Days) {
                 for(index = 0; index < this.currentTravel.Days.length; index++) {
                     totalExpenses += this.currentTravel.Days[index].Budget;
                 }
             }
         }
         return totalExpenses;
     }

    // END OF MARC'S CODE
    ////////////////////////////////////////////////////////////////////////////////////////////

    // DAYS AND CURRENT DAYS
    this.days = [];
    this.currentDay = {};

    function setCurrentDay(data) {
        this.currentDay.Id = data.Id;
        this.currentDay.Date = new Date(data.Date);
    }
};
