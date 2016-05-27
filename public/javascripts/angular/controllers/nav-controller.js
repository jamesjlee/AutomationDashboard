angular.module('automationDashboard').controller('NavCtrl', [
'$scope',
'auth',
'$location',
function($scope, auth, $location){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;

  $scope.go = function(path) {
    $location.path(path);
  };
}]);