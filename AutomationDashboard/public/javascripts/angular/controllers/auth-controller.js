angular.module('automationDashboard').controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};

  $scope.hideRegisterError = function() {
  	$('#registerError').hide();
  }

  $scope.hideLoginError = function() {
  	$('#loginError').hide();
  }

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
      $('#registerError').show();
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
      $('#loginError').show();
    }).then(function(){
      $state.go('home');
    });
  };
}])