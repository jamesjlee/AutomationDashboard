var app = angular.module('automationDashboard', ['ui.router', 'ui.bootstrap', 'ui.grid', 'ui.grid.resizeColumns','ui.grid.pagination', 'ui.grid.pinning', 'ui.grid.moveColumns', 'ui.grid.edit', 'schemaForm', 'mgcrea.ngStrap', 'ngSanitize']);

app.run(function($rootScope){
	$rootScope
		.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams){

		});
	$rootScope
		.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams){

		});
});

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				controller: 'HomeCtrl',
				templateUrl: 'partials/homeView.html',
				resolve: {
					getRecords: ['records', function(records){
						return records.getRecords();
					}],
					getAssets:  ['records', function(records){
						return records.getAssets();
					}]
				}
			})
			.state('login', {
			  url: '/login',
			  templateUrl: 'partials/login.html',
			  controller: 'AuthCtrl',
			  onEnter: ['$state', 'auth', function($state, auth){
			    if(auth.isLoggedIn()){
			      $state.go('home');
			    }
			  }]
			})
			.state('register', {
			  url: '/register',
			  templateUrl: 'partials/register.html',
			  controller: 'AuthCtrl',
			  onEnter: ['$state', 'auth', function($state, auth){
			    if(auth.isLoggedIn()){
			      $state.go('home');
			    }
			  }]
			})
			.state('admin', {
				url: '/admin',
				templateUrl: 'partials/admin.html',
				controller: 'AdminCtrl',
				resolve: {
					roleAuthenticate: ['$state', 'auth', function($state, auth){
						if(!auth.isLoggedIn()) {
							$state.go('home');
						}
						auth.isAdmin().then(function(result){
		  					var isAdmin = result.data[0].isAdmin;
		  					if(!isAdmin) {
		  						$state.go('home');
		  					}
		  				})
					}],
					getUsers: ['records', function(records){
						return records.getUsers();
					}]
				}
			})
		$urlRouterProvider.otherwise('home');
	}
]);