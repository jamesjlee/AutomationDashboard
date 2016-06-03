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
		$scope.editRow = RowEditor.editRow;
		$scope.addRow = RowEditor.addRow;
		$scope.grantUserPermission = RowEditor.grantUserPermission
		$scope.deleteRow = RowEditor.deleteRow;
		$scope.duplicateRow = RowEditor.duplicateRow;
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
	      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
			$http.get('/userHasPermission?user='+auth.currentUser()+'&rowId='+rowEntity._id).success(function(userHasPermission){
				auth.isAdmin().then(function(result){
					var isAdmin = result.data[0].isAdmin;
					if(userHasPermission || isAdmin) {
						rowEntity.cycleTimeSavingsNewTests = parseFloat(rowEntity.manualExecutionTimeNewTests) - parseFloat(rowEntity.automatedExecutionTimeNewTests);
						rowEntity.cycleTimeSavingsMaintainedTests = parseFloat(rowEntity.manualExecutionTimeMaintainedTests) - parseFloat(rowEntity.automatedExecutionTimeMaintainedTests);
						rowEntity.cycleTimeSavingsExecutedTests = parseFloat(rowEntity.manualExecutionTimeExecutedTests) - parseFloat(rowEntity.automatedExecutionTimeExecutedTests);
			            return $http.put('/records/' + rowEntity._id, rowEntity, {
							headers: {Authorization: 'Bearer '+auth.getToken()}
						}).success(function(data){
							console.log(data.message);
						});
			            $scope.$apply();
						$rootScope.homeError = '';
					} else {
						$rootScope.homeError = 'You do not have permission to edit this record!';
					}
				});
			});
          });
	    },
	    columnDefs: [
			{field: 'buttons', name: '', cellTemplate: '/partials/buttons.html', enableCellEdit: false, enableFiltering: false, pinnedLeft: true, width: 130},
			{field: 'project', name: 'Project', cellTemplate: '/partials/project.html', enableCellEdit: false, pinnedLeft: true, width: 100},
			{field: 'releaseName', name: 'Release Name', pinnedLeft: true, width: 100, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			{field: 'type', name: 'Type', width: 110,  enableCellEdit: false},
			{field: 'startDate', name: 'Reporting Start Date', cellFilter: 'date:\'MM-dd-yyyy\'', width: 110, enableCellEdit: false},
			{field: 'endDate', name: 'Reporting End Date', cellFilter: 'date:\'MM-dd-yyyy\'', width: 110, enableCellEdit: false},
			{field: 'newTestsAutomated', name: 'New Tests Automated', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			{field: 'manualExecutionTimeNewTests', name:'Manual Execution Time (New Tests)', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			{field: 'automatedExecutionTimeNewTests', name: 'Automated Execution Time (New Tests)', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			{field: 'cycleTimeSavingsNewTests', name: 'Cycle Time Savings (New Tests)', width: 150, enableCellEdit: false},
			{field: 'maintainedTests', name: 'Maintained Tests', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			{field: 'manualExecutionTimeMaintainedTests', name: 'Manual Execution Time (Maintained Tests)', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			{field: 'automatedExecutionTimeMaintainedTests', name: 'Automated Execution Time (Maintained Tests)', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			{field: 'cycleTimeSavingsMaintainedTests', name: 'Cycle Time Savings (Maintained Tests)', width: 150, enableCellEdit: false},
			{field: 'executedTests', name: 'Executed Tests', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			{field: 'manualExecutionTimeExecutedTests', name: 'Manual Execution Time (Executed Tests)', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			{field: 'automatedExecutionTimeExecutedTests', name: 'Automated Execution Time (Executed Tests)', width: 150, cellEditableCondition: function(){return $scope.isLoggedIn()}},
			{field: 'cycleTimeSavingsExecutedTests', name: 'Cycle Time Savings (Executed Tests)', width: 150, enableCellEdit: false},
			{field: 'comment', name: 'Comment', width: 1000, cellEditableCondition: function(){return $scope.isLoggedIn()}},
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