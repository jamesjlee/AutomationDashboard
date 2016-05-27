angular.module('automationDashboard').controller('HomeCtrl', [
	'$scope',
	'records',
	'RowEditor',
	'AssetService',
	'$state',
	'$http',
	'$timeout',
	'$uibModal',
	'$rootScope',
	'auth',
	function($scope, records, RowEditor, AssetService, $state, $http, $timeout, $uibModal, $rootScope, auth) {
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.userHasPermission = RowEditor.userHasPermission;
		$scope.editRow = RowEditor.editRow;
		$scope.addRow = RowEditor.addRow;
		$scope.grantUserPermission = RowEditor.grantUserPermission
		$scope.deleteRow = RowEditor.deleteRow;
		$scope.registerAsset = AssetService.registerAsset;
		$scope.editAsset = AssetService.editAsset;
		$scope.homeError;
		$scope.showHomeError = showErrorAlert;
		$scope.gridOptions = {
			paginationPageSizes: [25, 50, 75],
	    	paginationPageSize: 25,
			enableColumnResizing: true,
		    enableFiltering: true,
	    onRegisterApi: function(gridApi){
	      $scope.gridApi = gridApi;
	    },
	    columnDefs: [
			{field: 'buttons', name: '', cellTemplate: '/partials/buttons.html', enableFiltering: false, pinnedLeft: true, width: 97},
			{field: 'project', name: 'Project', cellTemplate: '/partials/project.html', pinnedLeft: true, width: 100},
			{field: 'releaseName', name: 'Release Name', pinnedLeft: true, width: 100},
			{field: 'type', name: 'Type', width: 110},
			{field: 'startDate', name: 'Reporting Start Date', cellFilter: 'date:\'MM-dd-yyyy\'', width: 110},
			{field: 'endDate', name: 'Reporting End Date', cellFilter: 'date:\'MM-dd-yyyy\'', width: 110},
			{field: 'newTestsAutomated', name: 'New Tests Automated', width: 150},
			{field: 'manualExecutionTimeNewTests', name:'Manual Execution Time (New Tests)', width: 150},
			{field: 'automatedExecutionTimeNewTests', name: 'Automated Execution Time (New Tests)', width: 150},
			{field: 'cycleTimeSavingsNewTests', name: 'Cycle Time Savings (New Tests)', width: 150},
			{field: 'maintainedTests', name: 'Maintained Tests', width: 150},
			{field: 'manualExecutionTimeMaintainedTests', name: 'Manual Execution Time (Maintained Tests)', width: 150},
			{field: 'automatedExecutionTimeMaintainedTests', name: 'Automated Execution Time (Maintained Tests)', width: 150},
			{field: 'cycleTimeSavingsMaintainedTests', name: 'Cycle Time Savings (Maintained Tests)', width: 150},
			{field: 'executedTests', name: 'Executed Tests', width: 150},
			{field: 'manualExecutionTimeExecutedTests', name: 'Manual Execution Time (Executed Tests)', width: 150},
			{field: 'automatedExecutionTimeExecutedTests', name: 'Automated Execution Time (Executed Tests)', width: 150},
			{field: 'cycleTimeSavingsExecutedTests', name: 'Cycle Time Savings (Executed Tests)', width: 150},
			{field: 'comment', name: 'Comment', width: 1000},
	    ]
	  };

	  	function showErrorAlert() {
	  		$('#gridErrorAlert').show();
	  	}

		$scope.hideErrorAlert = function() {
			$('#gridErrorAlert').hide();
		}
	
		$scope.gridOptions.data = records.records;
	}
]);