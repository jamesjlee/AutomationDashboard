angular.module('automationDashboard').service('RowEditor', [
	'$rootScope',
	'$uibModal',
	'records',
	'MetricsSchema',
	'auth',
	'$http',
	function RowEditor($rootScope, $uibModal, records, MetricsSchema, auth, $http) {
	  var service = {};
	  service.editRow = editRow;
	  service.addRow = addRow;
	  service.deleteRow = deleteRow;
	  service.grantUserPermission = grantUserPermission;
	  service.duplicateRow = duplicateRow;

	  function addRow() {
	    $uibModal.open({
	      templateUrl: '/partials/add-modal.html',
	      controller: ['$scope', 'MetricsSchema', 'records', '$uibModalInstance', 'auth', RowAddCtrl]
	    });
	  }
	  
	  function editRow(grid, row) {
	  	console.log(row);
	  	var entity = angular.copy(row.entity);
	  	$http.get('/userHasPermission?user='+auth.currentUser()+'&rowId='+entity._id).success(function(userHasPermission){
	  		auth.isAdmin().then(function(result){
	  			var isAdmin = result.data[0].isAdmin;
	  			if(userHasPermission || isAdmin) {
					$uibModal.open({
					  templateUrl: '/partials/edit-row-modal.html',
					  controller: ['$scope', 'MetricsSchema', '$uibModalInstance', 'records', 'grid', 'row', RowEditCtrl],
					  resolve: {
					    grid: function () { return grid; },
					    row: function () { return row; }
					  }
					});
					$rootScope.homeError = '';
		  		} else {
		  			$rootScope.homeError = 'You do not have permission to edit this record!';
		  		}
	  		});
		});	
	  }

	  function deleteRow(grid, row) {
	  	var entity = angular.copy(row.entity);
	  	$http.get('/userHasPermission?user='+auth.currentUser()+'&rowId='+entity._id).success(function(userHasPermission){
	  		auth.isAdmin().then(function(result){
	  			var isAdmin = result.data[0].isAdmin;
		  		if(userHasPermission || isAdmin) {
		  			$uibModal.open({
					  templateUrl: '/partials/delete-row-modal.html',
					  controller: ['$scope', '$uibModalInstance', 'records', 'grid', 'row', RowDeleteCtrl],
					  resolve: {
					    grid: function () { return grid; },
					    row: function () { return row; }
					  }
					});
					$rootScope.homeError = '';
		  		} else {
		  			$rootScope.homeError = 'You do not have permission to delete this record!';
		  		}
	  		});
		});	
	  }

	  function grantUserPermission(grid, row) {
	  	var entity = angular.copy(row.entity);
		$http.get('/userHasPermission?user='+auth.currentUser()+'&rowId='+entity._id).success(function(userHasPermission){
			auth.isAdmin().then(function(result){
	  			var isAdmin = result.data[0].isAdmin;
		  		if(userHasPermission || isAdmin) {
					$uibModal.open({
					  templateUrl: '/partials/grant-user-permission-modal.html',
					  controller: ['$scope', 'MetricsSchema', '$uibModalInstance', 'records', 'getUserNames', 'grid', 'row', 'auth', GrantUserPermissionCtrl],
					  resolve: {
					  	getUserNames:  ['auth', function(auth){
							return auth.getUserNames();
						}],
						grid: function () { return grid; },
					    row: function () { return row; }
					  }
					});
					$rootScope.homeError = '';
		  		} else {
		  			$rootScope.homeError = 'You do not have permission to give users access for this record!';
		  		}
	  		});
		});	
	  }

	  function duplicateRow(grid, row) {
	  	var entity = angular.copy(row.entity);
		$http.get('/userHasPermission?user='+auth.currentUser()+'&rowId='+entity._id).success(function(userHasPermission){
			auth.isAdmin().then(function(result){
	  			var isAdmin = result.data[0].isAdmin;
		  		if(userHasPermission || isAdmin) {
					$uibModal.open({
					  templateUrl: '/partials/duplicate-row-modal.html',
					  controller: ['$scope', '$uibModalInstance', 'records', 'grid', 'row', DuplicateRowCtrl],
					  resolve: {
						grid: function () { return grid; },
					    row: function () { return row; }
					  }
					});
					$rootScope.homeError = '';
		  		} else {
		  			$rootScope.homeError = 'You do not have permission to duplicate this record!';
		  		}
	  		});
		});	
	  }
	  return service;
	}
]);

function DuplicateRowCtrl($scope, $uibModalInstance, records, grid, row) {
	$scope.duplicateRow = function() {
		records.duplicateRecord(row.entity);
		$uibModalInstance.dismiss('cancel');
	}
}


function RowDeleteCtrl($scope, $uibModalInstance, records, grid, row) {
	$scope.deleteRow = function() {
		records.deleteRecord(row.entity);
		$uibModalInstance.dismiss('cancel');
	}
}

function GrantUserPermissionCtrl($scope, MetricsSchema, $uibModalInstance, records, getUserNames, grid, row, auth) {
	$scope.onSubmit = onSubmit;
	function getUsers() {
		var users = [];
		for(var i=0;i<getUserNames.data.length;i++){
			console.log(getUserNames.data[i]);
			if(!getUserNames.data[i].isAdmin && getUserNames.data[i].username !== auth.currentUser()) {
				users.push(getUserNames.data[i].username);
			}
		}
		return users;
	}

	$scope.entity = {};
	
	$scope.schema = {
	  	type: 'object',
		properties: {
			users: {
				type: 'string',
				title: 'Users',
				placeholder: '--- Select One ---',
				enum: getUsers(),
			},
		},
		required: [
			'users',
		]
	};

	$scope.form = [
	  	{
	  		'key': 'users',
	  		'validationMessage': 'Required',
	  	},
	];

	function onSubmit(form) {
		console.log('in here');
	  	$scope.$broadcast('schemaFormValidate');

		if (form.$valid) {
			records.updateUsers($scope.entity, row.entity);
		    $uibModalInstance.dismiss('cancel');
		}
	}
}

function RowEditCtrl($scope, MetricsSchema, $uibModalInstance, records, grid, row) {
  $scope.onSubmit = onSubmit;
  function getAssetNames() {
  	var assetNames = [];
  	for(var i=0; i<records.assets.length; i++) {
  		assetNames.push(records.assets[i].assetName);
  	}
  	return assetNames;
  }
  $scope.schema = {
  	type: 'object',
	properties: {
		project: {
			type: 'string',
			title: 'Asset',
			placeholder: '--- Select One ---',
			enum: getAssetNames(),
		},
		releaseName: {type: 'string', title: 'Release Name'},
		type: {
			title: 'Type',
			type: 'string',
			enum: ['SIT', 'UAT', 'DEV', 'SHAKEOUT'],
			placeholder: '--- Select One ---',
		},
		startDate: {type: 'string', format: 'date', title: 'Reporting Start Date'},
		endDate: {type: 'string', format: 'date', title: 'Reporting End Date'},
		newTestsAutomated: {type: 'number', title: 'New Tests Automated'},
		manualExecutionTimeNewTests: {type: 'number', title: 'Manual Execution Time (New Tests)'},
		automatedExecutionTimeNewTests: {type: 'number', title: 'Automated Execution Time (New Tests)'},
		// cycleTimeSavingsNewTests: {type: 'number', title: 'Cycle Time Savings (New Tests)'},
		maintainedTests: {type: 'number', title: 'Maintained Tests'},
		manualExecutionTimeMaintainedTests: {type: 'number', title: 'Manual Execution Time (Maintained Tests)'},
		automatedExecutionTimeMaintainedTests: {type: 'number', title: 'Automated Execution Time (Maintained Tests)'},
		// cycleTimeSavingsMaintainedTests: {type: 'number', title: 'Cycle Time Savings (Maintained Tests)'},
		executedTests: {type: 'number', title: 'Executed Tests'},
		manualExecutionTimeExecutedTests: {type: 'number', title: 'Manual Execution Time (Executed Tests)'},
		automatedExecutionTimeExecutedTests: {type: 'number', title: 'Automated Execution Time (Executed Tests)'},
		// cycleTimeSavingsExecutedTests: {type: 'number', title: 'Cycle Time Savings (Executed Tests)'},
		comment: {type: 'string', title: 'Comment'},
	},
	required: [
		'project',
		'releaseName',
	]
  };

  $scope.entity = angular.copy(row.entity);
  $scope.form = [
  	{
  		'key': 'project',
  		'validationMessage': 'Required',
  	},
	'releaseName',
	'type',
	{
		"key": "startDate",
		"minDate": "1995-09-01",
		"maxDate": new Date(),
		"format": "yyyy-mm-dd"
	},
	{
		"key": "endDate",
		"minDate": "1995-09-01",
		"maxDate": new Date(),
		"format": "yyyy-mm-dd"
	},
	'newTestsAutomated',
	'manualExecutionTimeNewTests',
	'automatedExecutionTimeNewTests',
	// 'cycleTimeSavingsNewTests',
	'maintainedTests',
	'manualExecutionTimeMaintainedTests',
	'automatedExecutionTimeMaintainedTests',
	// 'cycleTimeSavingsMaintainedTests',
	'executedTests',
	'manualExecutionTimeExecutedTests',
	'automatedExecutionTimeExecutedTests',
	// 'cycleTimeSavingsExecutedTests',
	{
		'key': 'comment',
		'type': 'textarea',
		'placeholder': 'Make a comment'
	},
  ];
  
  function onSubmit(form) {
  	$scope.$broadcast('schemaFormValidate');

	if (form.$valid) {
		$scope.entity.cycleTimeSavingsNewTests = $scope.entity.manualExecutionTimeNewTests - $scope.entity.automatedExecutionTimeNewTests;
		$scope.entity.cycleTimeSavingsMaintainedTests = $scope.entity.manualExecutionTimeMaintainedTests - $scope.entity.automatedExecutionTimeMaintainedTests;
		$scope.entity.cycleTimeSavingsExecutedTests = $scope.entity.manualExecutionTimeExecutedTests - $scope.entity.automatedExecutionTimeExecutedTests;
		records.updateRecord($scope.entity);
	    row.entity = $scope.entity;
	    $uibModalInstance.dismiss('cancel');
	}
  }
}

function RowAddCtrl($scope, MetricsSchema, records, $uibModalInstance, auth) {
	$scope.currentUser = auth.currentUser();
	// console.log($scope.currentUser);
	$scope.onSubmit = onSubmit;
	function getAssetNames() {
		var assetNames = [];
		for(var i=0; i<records.assets.length; i++) {
			assetNames.push(records.assets[i].assetName);
		}
		return assetNames;
	}
	$scope.schema = {
	  	type: 'object',
		properties: {
			project: {
				type: 'string', 
				title: 'Asset',
				placeholder: '--- Select One ---',
				enum: getAssetNames(),
			},
			releaseName: {type: 'string', title: 'Release Name'},
			type: {
				title: 'Type',
				type: 'string',
				enum: ['SIT', 'UAT', 'DEV', 'SHAKEOUT'],
				placeholder: '--- Select One ---',
			},
			startDate: {type: 'string', format: 'date', title: 'Reporting Start Date'},
			endDate: {type: 'string', format: 'date', title: 'Reporting End Date'},
			newTestsAutomated: {type: 'number', title: 'New Tests Automated'},
			manualExecutionTimeNewTests: {type: 'number', title: 'Manual Execution Time (New Tests)'},
			automatedExecutionTimeNewTests: {type: 'number', title: 'Automated Execution Time (New Tests)'},
			// cycleTimeSavingsNewTests: {type: 'number', title: 'Cycle Time Savings (New Tests)'},
			maintainedTests: {type: 'number', title: 'Maintained Tests'},
			manualExecutionTimeMaintainedTests: {type: 'number', title: 'Manual Execution Time (Maintained Tests)'},
			automatedExecutionTimeMaintainedTests: {type: 'number', title: 'Automated Execution Time (Maintained Tests)'},
			// cycleTimeSavingsMaintainedTests: {type: 'number', title: 'Cycle Time Savings (Maintained Tests)'},
			executedTests: {type: 'number', title: 'Executed Tests'},
			manualExecutionTimeExecutedTests: {type: 'number', title: 'Manual Execution Time (Executed Tests)'},
			automatedExecutionTimeExecutedTests: {type: 'number', title: 'Automated Execution Time (Executed Tests)'},
			// cycleTimeSavingsExecutedTests: {type: 'number', title: 'Cycle Time Savings (Executed Tests)'},
			comment: {type: 'string', title: 'Comment'},
		},
		required: [
			'project',
			'releaseName',
		]
  	};
	$scope.entity = {};
	$scope.entity.users = [];
	$scope.entity.users.push($scope.currentUser);
	$scope.form = [
		{
  			'key': 'project',
	  		'validationMessage': 'Required',
	  	},
		'releaseName',
		'type',
		{
			"key": "startDate",
			"minDate": "1995-09-01",
			"maxDate": new Date(),
			"format": "yyyy-mm-dd"
		},
		{
			"key": "endDate",
			"minDate": "1995-09-01",
			"maxDate": new Date(),
			"format": "yyyy-mm-dd"
  		},
		'newTestsAutomated',
		'manualExecutionTimeNewTests',
		'automatedExecutionTimeNewTests',
		// 'cycleTimeSavingsNewTests',
		'maintainedTests',
		'manualExecutionTimeMaintainedTests',
		'automatedExecutionTimeMaintainedTests',
		// 'cycleTimeSavingsMaintainedTests',
		'executedTests',
		'manualExecutionTimeExecutedTests',
		'automatedExecutionTimeExecutedTests',
		// 'cycleTimeSavingsExecutedTests',
		{
			'key': 'comment',
			'type': 'textarea',
			'placeholder': 'Make a comment'
		},
	];

	function onSubmit(form) {
		// First we broadcast an event so all fields validate themselves
		$scope.$broadcast('schemaFormValidate');

		// Then we check if the form is valid
		if (form.$valid) {
		  // ... do whatever you need to do with your data.
			$scope.entity.cycleTimeSavingsNewTests = $scope.entity.manualExecutionTimeNewTests - $scope.entity.automatedExecutionTimeNewTests;
			$scope.entity.cycleTimeSavingsMaintainedTests = $scope.entity.manualExecutionTimeMaintainedTests - $scope.entity.automatedExecutionTimeMaintainedTests;
			$scope.entity.cycleTimeSavingsExecutedTests = $scope.entity.manualExecutionTimeExecutedTests - $scope.entity.automatedExecutionTimeExecutedTests;
			records.addRecord($scope.entity);
			$uibModalInstance.dismiss('cancel');
		}
	}
}