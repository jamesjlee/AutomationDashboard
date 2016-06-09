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
	  		auth.isAdmin().then(function(result){
	  			var isAdmin = result.data[0].isAdmin;
	  			if(userHasPermission || isAdmin) {
				  	$uibModal.open({
				  		templateUrl: '/partials/edit-asset-modal.html',
				  		controller: ['$scope', 'AssetSchema', 'records', '$uibModal', '$uibModalInstance', 'getAssetInfo', 'grid', 'row', EditAssetCtrl],
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
	  		controller: ['$scope', '$rootScope', 'records', '$uibModalInstance', 'editAssetGrid', 'editAssetRow', 'auth', DeleteAssetCtrl],
	  		resolve: {
	  			editAssetGrid: function () { return $scope.grid; },
				editAssetRow: function () { return $scope.row; }
	  		}
	  	});
  		
	}

	function DeleteAssetCtrl($scope, $rootScope, records, $uibModalInstance, editAssetGrid, editAssetRow, auth) {

		$scope.deleteAllAssetRecords = function() {
			var rows = editAssetGrid.rows;
			auth.isAdmin().then(function(result){
				var isAdmin = result.data[0].isAdmin;
				if(isAdmin) {
					records.deleteAsset(editAssetRow.entity).then(function(result){
						for(var i=0;i<rows.length;i++) {
							if(rows[i].entity.project === editAssetRow.entity.project) {
								var rowId = rows[i].entity._id;
								records.deleteRecord(rows[i].entity);
							}
						}
					});
					$rootScope.homeError = '';
				} else {
					$rootScope.homeError = 'You must have admin access to delete this asset!';
				}
			});
			
			$uibModalInstance.dismiss('cancel');
		}
	}

	$scope.schema = AssetSchema;
	$scope.entity = {
		_id: getAssetInfo.data._id,
		assetName: getAssetInfo.data.assetName,
		assetId: getAssetInfo.data.assetId,
		assetPoc:  getAssetInfo.data.assetPoc,
		assetSoc: getAssetInfo.data.assetSoc,
		assetStatus: getAssetInfo.data.assetStatus
	}
	$scope.form = [
		{
			'key': 'assetName',
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
					console.log(result.data.message);
					// console.log(result);
					if(result.data.message !== 'Asset already exists!') {
						for(var i=0;i<grid.rows.length;i++) {
							if(grid.rows[i].entity.project == oldName) {
								grid.rows[i].entity.project = $scope.entity.assetName;;
							}
						}
						$uibModalInstance.dismiss('cancel');
					} else {
						$('#editAssetModalError').show();
						$scope.error = 'Asset already exists! Please choose another asset name.'
					}
				});
			}
		}
}