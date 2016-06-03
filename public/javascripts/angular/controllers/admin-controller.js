angular.module('automationDashboard').controller('AdminCtrl', [
'$scope',
'$state',
'records',
'auth',
function($scope, $state, records, auth){
  $scope.users = [];
  $scope.admins = [];

  var currentUser = auth.currentUser();

  for(var i=0;i<records.users.length;i++) {
    if(records.users[i].isAdmin && records.users[i].username !== currentUser) {
      $scope.admins.push(records.users[i]);
    } else if(records.users[i].username !== currentUser) {
        $scope.users.push(records.users[i]);
    }
  }

  $scope.userToAdmin = function() {
    if(typeof $scope.selectedUser !== 'undefined') {
      for(var i=0;i<$scope.selectedUser.length;i++) {
        for(var j=0; j<$scope.users.length; j++) {
          if($scope.selectedUser[i] === $scope.users[j].username) {
            records.changeAccess($scope.users[j]);
            $scope.admins.push($scope.users[j]);
            $scope.users.splice(j, 1);
          }
        }
      }
    }
  };
  $scope.adminToUser = function() {
    if(typeof $scope.selectedAdmin !== 'undefined') {
      for(var i=0;i<$scope.selectedAdmin.length;i++) {
        for(var j=0; j<$scope.admins.length; j++) {
          if($scope.selectedAdmin[i] === $scope.admins[j].username) {
            records.changeAccess($scope.admins[j]);
            $scope.users.push($scope.admins[j]);
            $scope.admins.splice(j, 1);
          }
        }
      }
    }
  };



}]);