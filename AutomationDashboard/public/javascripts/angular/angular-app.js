var app = angular.module('automationDashboard', ['ui.router', 'ui.bootstrap', 'ui.grid', 'ui.grid.resizeColumns','ui.grid.pagination', 'ui.grid.pinning', 'ui.grid.moveColumns', 'schemaForm', 'mgcrea.ngStrap', 'ngSanitize']);

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
					postPromise: ['records', function(records){
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
		$urlRouterProvider.otherwise('home');
	}
]);