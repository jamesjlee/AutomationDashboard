angular.module('automationDashboard').service('AssetService', [
	'$rootScope',
	'$uibModal',
	'records',
	'AssetSchema',
	'$http',
	'auth',
	function AssetService($rootScope, $uibModal, records, AssetSchema, $http, auth) {
	  var service = {};
	  service.registerAsset = registerAsset;
	  service.editAsset = editAsset;

	  function registerAsset() {
	  	$uibModal.open({
	      templateUrl: '/partials/register-asset-modal.html',
	      controller: ['$scope', 'AssetSchema', 'records', '$uibModalInstance', RegisterAssetCtrl]
	    });
	  }

	  function editAsset(grid, row) {
	  	var entity = angular.copy(row.entity);
	  	$http.get('/userHasPermission?user='+auth.currentUser()+'&rowId='+entity._id).success(function(userHasPermission){
	  		if(userHasPermission) {
			  	$uibModal.open({
			  		templateUrl: '/partials/edit-asset-modal.html',
			  		controller: ['$scope', 'AssetSchema', 'records', '$uibModal', '$uibModalInstance', 'getAssetInfo', 'grid', 'row',EditAssetCtrl],
			  		resolve: {
			  			getAssetInfo:  ['records', function(records){
							return records.getAssetInfo(entity);
						}],
						grid: function () { return grid; },
			       		row: function () { return row; }
			  		}
			  	});
			  	$rootScope.homeError = '';
	  		} else {
				$rootScope.homeError = 'You do not have permission to edit this asset!';	  			
	  		}
	  	});
	  }

	  return service;
	}
]);

function RegisterAssetCtrl($scope, AssetSchema, records, $uibModalInstance) {
  $scope.schema = AssetSchema;
  $scope.hideRegisterAssetModalError = function() {
  	$('#registerAssetModalError').hide();
  }
  $scope.entity = {};
  $scope.form = [
	'assetName',
  	'assetId',
	'assetPoc',
	'assetSoc',
	{
		'key': 'assetStatus',
		'validationMessage': 'Required',
	}
  ];
  
  $scope.onSubmit = onSubmit;
  
  function onSubmit(form) {
  	$scope.$broadcast('schemaFormValidate');

	if (form.$valid) {
		records.registerAsset($scope.entity).then(function(result){
			console.log(result);
			if(result.data == 'Asset already exists!') {
				$('#registerAssetModalError').show();
				$scope.error = 'Asset already exists! Please choose another asset name.';
			} else {
				$uibModalInstance.dismiss('cancel');
			}
		});
	}
  }
}

function EditAssetCtrl($scope, AssetSchema, records, $uibModal, $uibModalInstance, getAssetInfo, grid, row) {
	var oldName = row.entity.project;
	$scope.grid = grid;
	$scope.row = row;
	$scope.hideEditAssetModalError = function() {
		$('#editAssetModalError').hide();
	}
	$scope.deleteAsset = function() {
		console.log($scope.grid.rows);
		$uibModalInstance.dismiss('cancel');
		$uibModal.open({
	  		templateUrl: '/partials/delete-asset-modal.html',
	  		// scope: $scope,
	  		controller: ['$scope', 'AssetSchema', 'records', '$uibModal', '$uibModalInstance', 'editAssetGrid', 'editAssetRow', DeleteAssetCtrl],
	  		// controller: 'DeleteAssetCtrl',
	  		resolve: {
	  			// console.log($scope.grid);
	  			editAssetGrid: function () { return $scope.grid; },
				editAssetRow: function () { return $scope.row; }
	  		}
	  	});
  		
	}
	// $scope.deleteAllAssetRecords = function($scope, AssetSchema, records, $uibModal, $uibModalInstance, grid, row) {
	// 	console.log('in here');
	// 	console.log(row);
	// }

	function DeleteAssetCtrl($scope, AssetSchema, records, $uibModal, $uibModalInstance, editAssetGrid, editAssetRow) {

		$scope.deleteAllAssetRecords = function() {
			var rows = editAssetGrid.rows;

			records.deleteAsset(editAssetRow.entity.project).then(function(result){
				for(var i=0;i<rows.length;i++) {
					if(rows[i].entity.project === editAssetRow.entity.project) {
						var rowId = rows[i].entity._id;
						records.deleteAssetRecord(rowId);
					}
				}
			});
			$uibModalInstance.dismiss('cancel');
		}
	}

	$scope.schema = AssetSchema;
	$scope.entity = {
		_id: getAssetInfo.data[0]._id,
		assetName: getAssetInfo.data[0].assetName,
		assetId: getAssetInfo.data[0].assetId,
		assetPoc:  getAssetInfo.data[0].assetPoc,
		assetSoc: getAssetInfo.data[0].assetSoc,
		assetStatus: getAssetInfo.data[0].assetStatus
	}
	$scope.form = [
		{
			'key': 'assetName',
			'readonly':true,
		},
		'assetId',
		'assetPoc',
		'assetSoc',
		{
			'key': 'assetStatus',
			'validationMessage': 'Required',
		}
		];

		$scope.onSubmit = onSubmit;

		function onSubmit(form) {
			$scope.$broadcast('schemaFormValidate');

		if (form.$valid) {
			records.updateAsset($scope.entity).then(function(result){
				$uibModalInstance.dismiss('cancel');
				// console.log(result);
				// if(result.data !== 'Asset already exists!') {
				// 	for(var i=0;i<grid.rows.length;i++) {
				// 		if(grid.rows[i].entity.project == oldName) {
				// 			grid.rows[i].entity.project = $scope.entity.assetName;;
				// 		}
				// 	}
				// 	$uibModalInstance.dismiss('cancel');
				// } else {
				// 	$('#editAssetModalError').show();
				// 	$scope.error = 'Asset already exists! Please choose another asset name.'
				// }
			});
		}
	}
}