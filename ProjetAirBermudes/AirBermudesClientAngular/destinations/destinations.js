angular.module('AppAirBermudes.destinations',[])
.controller('DestinationsController',DestinationsController)

function DestinationsController($scope,IdentityService,MsgFlashService,$location,$timeout)
{

  //messages from the msgservice
  //$scope.flashMessage = MsgFlashService.getMessage();
  //$scope.flashErrors = MsgFlashService.getErrorMessage();
  $scope.flashMessage = "";
  $scope.flashErrors = "";
  $scope.showAlertSucess = false;
  $scope.showAlertError = false;

  $scope.errorMessages = [];

  $scope.hasErrors = false;

  ////show or not to show the messages
  //$scope.showAlertSucess = MsgFlashService.showMessage;
  //$scope.showAlertError = MsgFlashService.showErrorMessage;
  //MsgFlashService.hideMessages();

  var headers = {};
  headers.Authorization = 'Bearer ' + IdentityService.getToken();

  $scope.destinations = [];


  $scope.getDestinations = function(){

    $.ajax({
        method: 'GET',
        url: "http://localhost:53762/api/Destinations/",
        headers: headers
    })
        .success(function (data) {
            console.log("Data from API ", data);
            $scope.destinations = data;
            console.log("Data from destinations array ", $scope.destinations);
            //sets a Position field to items in the array for Listing on the index
            for (var i = 0; i < $scope.destinations.length; i++) {
                var course = $scope.destinations[i];
                course.Position = i + 1;
            }
            //console.log("Data from destinations array ", $scope.destinations);
            $scope.$apply();
        })
        .error(function (error) {
            console.log(error);
        });

  }

  $scope.addDestination = function () {

      //dest type toLowerCase for seemingless integration to google maps API
      var DestTypeToLower = $scope.DestType.toLowerCase();
      //checking if the destype is amusement park
      if(DestTypeToLower === "amusement park"){
         DestTypeToLower = "amusement_park"
      }

      $.ajax({
          method: 'POST',
          url: "http://localhost:53762/api/Destinations/",
          headers: headers,
          data:
              {
                  Type: DestTypeToLower,
                  Name: $scope.DestName,
                  Address: $scope.DestinationAddress,
              }
      })
          .success(function (data) {
              console.log(data);
              MsgFlashService.setMessage("Succesfully added this destination to this travel! You are now going to be redirected back to index");
              $scope.flashMessage = MsgFlashService.getMessage();
              $scope.showAlertSucess = MsgFlashService.showMessage;
              $scope.$apply();
              $timeout(function () {
                  $location.path("/destinations")
              }, 2000);
          })
          .error(function (error) {
              MsgFlashService.setErrorMessage(error.responseText);
              $scope.flashErrors = MsgFlashService.getErrorMessage();
              $scope.showAlertError = MsgFlashService.showErrorMessage;
              //console.log(error);

              var modelState = $.parseJSON(error.responseText).ModelState
              //console.log(modelState);

              $scope.errorMessages = [];

              if (modelState) {

                  var modelStateDepartureAddressRequired = modelState["courseDTO.DepartureAddress"];
                  var modelStateDestinationAddressRequired = modelState["courseDTO.DestinationAddress"];
                  var modelStateEndDateRequired = modelState["courseDTO.EndDate"];
                  var modelStateStartDateRequired = modelState["courseDTO.StartDate"];
                  var modelStateTransportCompanyNameRequired = modelState["courseDTO.TransportCompanyName"];

                  if (modelStateDepartureAddressRequired) {
                      var DepartureMess = modelStateDepartureAddressRequired[0];
                      if (DepartureMess) {
                          $scope.errorMessages.push(DepartureMess);
                      }
                  }
                  if (modelStateDestinationAddressRequired) {
                      var DestinationMess = modelStateDestinationAddressRequired[0];
                      if (DestinationMess) {
                          $scope.errorMessages.push(DestinationMess);
                      }
                  }
                  if (modelStateEndDateRequired) {
                      var EndDateMess = modelStateEndDateRequired[0];
                      if (EndDateMess) {
                          $scope.errorMessages.push(EndDateMess);
                      }
                  }
                  if (modelStateStartDateRequired) {
                      var StartDateMess = modelStateStartDateRequired[0];
                      if (StartDateMess) {
                          $scope.errorMessages.push(StartDateMess);
                      }
                  }
                  if (modelStateTransportCompanyNameRequired) {
                      var TransportNameMess = modelStateTransportCompanyNameRequired[0];
                      if (TransportNameMess) {
                          $scope.errorMessages.push(TransportNameMess);
                      }
                  }

                  $scope.hasErrors = true;
              }
              console.log("ErrorMessages Array: " ,$scope.errorMessages);
              $scope.$apply();
          });
        }


}
