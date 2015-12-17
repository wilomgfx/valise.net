angular.module('AppAirBermudes.destinations',['ngRoute'])
.controller('DestinationsController',DestinationsController)

function DestinationsController($scope,$routeParams,IdentityService,MsgFlashService,$location,$timeout )
{

  //SelectList for TransportTypes
  $scope.selecListChoices = {
      availableOptions: [
        // { DayID: '1', Date: '2015-12-17' },
        // { DayID: '2', Date: '2015-12-19' },
        // { DayID: '3', Date: '2015-12-21' }
      ],
      selectedOption: {  } //This sets the default value of the select in the ui
  };
  //messages from the msgservice
  //$scope.flashMessage = MsgFlashService.getMessage();
  //$scope.flashErrors = MsgFlashService.getErrorMessage();
  $scope.flashMessage = "";
  $scope.flashErrors = "";
  $scope.showAlertSucess = false;
  $scope.showAlertError = false;

  $scope.errorMessages = [];

  $scope.hasErrors = false;


  $scope.onEditDestination = function (id){
    console.log("onEditDestination");
    $location.path("/destinations/edit/" + id)
  }

  ////show or not to show the messages
  //$scope.showAlertSucess = MsgFlashService.showMessage;
  //$scope.showAlertError = MsgFlashService.showErrorMessage;
  //MsgFlashService.hideMessages();

  var headers = {};
  headers.Authorization = 'Bearer ' + IdentityService.getToken();

  $scope.destinations = [];

  $scope.getDays = function () {
      $.ajax({
          method: 'GET',
          url: "http://localhost:53762/api/Days/",
          headers: headers
      })
          .success(function (data) {
              //console.log("Data from API ", data);
              for (var i = 0; i < data.length; i++) {
                  $scope.selecListChoices.availableOptions[i] = data[i];
              }
              $scope.selecListChoices.selectedOption = $scope.selecListChoices.availableOptions[0];
              //$scope.selecListChoices.availableOptions = data;
              //console.log("Data from selecListChoices array ", $scope.selecListChoices);
              $scope.$apply();
          })
          .error(function (error) {
              console.log(error);
          });
  }

  angular.element(document).ready(function () {
      $scope.getDays();
  });

  //TODO change move ajax calls to a service

  $scope.currentDestination = {};

  $scope.onEdit = function (id){
    console.log("onEditDestination");
    $location.path("/destinations/edit/" + id)
  }

  $scope.getDestination = function (id) {
      console.log("getDestination ID = " + id);

      $.ajax({
          method: 'GET',
          url: "http://localhost:53762/api/Destinations/"+id,
          dataType: 'json',
          contentType: 'application/json',
          headers: headers

      })
      .success(function (data) {
          console.log("getDestination: OK");
          //console.log(data);
          $scope.currentDestination = data;
          console.log("Current destination : ", $scope.currentDestination);

          //TODO set the selected day to the destination's current day

          $scope.$apply();
      })
      .fail(function (error){
        console.log("oups ",error);
      });
  }

  $scope.getDestinationsForSpecificDay = function(DayId){

    $.ajax({
        method: 'GET',
        url: "http://localhost:53762/api/Destinations/DestinationsForSpecificDay/"+DayId,
        headers: headers
    })
        .success(function (data) {
            console.log("Data from API ", data);
            $scope.destinations = data;
            console.log("Data from destinations array ", $scope.destinations);
            //sets a Position field to items in the array for Listing on the index
            for (var i = 0; i < $scope.destinations.length; i++) {
                var destination = $scope.destinations[i];
                destination.Position = i + 1;
            }
            //console.log("Data from destinations array ", $scope.destinations);
            $scope.$apply();
        })
        .error(function (error) {
            console.log(error);
        });

  }

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
                var destination = $scope.destinations[i];
                destination.Position = i + 1;
            }
            //console.log("Data from destinations array ", $scope.destinations);
            $scope.$apply();
        })
        .error(function (error) {
            console.log(error);
        });

  }

  $scope.addDestination = function (Day) {

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
                  DayID : Day.Id
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

        $scope.deleteDistination = function (Id) {
            $.ajax({
                method: 'DELETE',
                url: "http://localhost:53762/api/Destinations/" + Id,
                headers: headers
            })
                .success(function (data) {
                    console.log("Data from API ", data);
                    MsgFlashService.setMessage("Succesfully added your destination to this travel!");
                    $scope.flashMessage = MsgFlashService.getMessage();
                    $scope.showAlertSucess = MsgFlashService.showMessage;
                    $scope.getDestinations();
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        $scope.editDestination = function (Day) {

              //dest type toLowerCase for seemingless integration to google maps API
              var DestTypeToLower = $scope.currentDestination.Type.toLowerCase();
              //checking if the destype is amusement park
              if(DestTypeToLower === "amusement park"){
                 DestTypeToLower = "amusement_park"
              }
                $.ajax({
                    method: 'PUT',
                    url: "http://localhost:53762/api/Destinations/" + $scope.currentDestination.DestinationID,
                    headers: headers,
                    data: {
                      DestinationID : $scope.currentDestination.DestinationID,
                      Type: DestTypeToLower,
                      Name: $scope.currentDestination.Name,
                      Address: $scope.currentDestination.Address,
                      Day : Day
                    }
                })
                    .success(function (data) {
                        console.log("Successfully updated the course");
                        $scope.getDestinations();
                        $scope.$apply(function(){
                          MsgFlashService.setMessage("Succesfully edit this destination to this travel! You are now going to be redirected back to index");
                          $scope.flashMessage = MsgFlashService.getMessage();
                          $scope.showAlertSucess = MsgFlashService.showMessage;
                          $timeout(function () {
                              $location.path("/destinations")
                          }, 2000);
                        })
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }


        console.log("Action: " + $routeParams.action);
        if ($routeParams.action == "edit") {
            console.log("edit");
            $scope.getDestination($routeParams.id);
        }else if ($routeParams.action == "seeDests") {
            $scope.getDestinationsForSpecificDay($routeParams.id);
        } else if ($routeParams.action === undefined) {
            $scope.getDestinations();
        }


}
