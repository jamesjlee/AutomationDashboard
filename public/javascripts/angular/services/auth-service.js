angular.module('automationDashboard').factory('auth', ['$http', '$window', '$state', function($http, $window, $state){
   var auth = {};

   auth.saveToken = function (token){
  		$window.localStorage['test-automation-token'] = token;
  	};

	auth.getToken = function (){
	  return $window.localStorage['test-automation-token'];
	};

	auth.isLoggedIn = function(){
	  var token = auth.getToken();

	  if(token){
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.exp > Date.now() / 1000;
	  } else {
	    return false;
	  }
	};

	auth.currentUser = function(){
	  if(auth.isLoggedIn()){
	    var token = auth.getToken();
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.username;
	  }
	};

	auth.register = function(user){
	  return $http.post('/register', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	auth.logIn = function(user){
	  return $http.post('/login', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	auth.logOut = function(){
	  $window.localStorage.removeItem('test-automation-token');
	  $state.go('home');
	};

	auth.getUserNames = function(){
		return $http.get('/users').success(function(data){
			console.log(data);
	  	});
	};

	auth.isAdmin = function() {
		if(auth.isLoggedIn()){
		    var token = auth.getToken();
		    var payload = JSON.parse($window.atob(token.split('.')[1]));

		    return $http.get('/users-findByUsername?username='+payload.username).success(function(data){
				console.log(data);
			});
		}
	}

  return auth;
}]);