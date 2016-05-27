angular.module('automationDashboard').factory('records', [
	'$http',
	'$state',
	'auth',
	function($http, $state, auth) {
		var o = {
			records: [],
			assets: [],
		};

		o.getRecords = function() {
			return $http.get('/records').success(function(data){
				// console.log(data);
				angular.copy(data, o.records);
				console.log(o.records);
			});
		};

		o.getAssets = function() {
			return $http.get('/assets').success(function(data){
				// console.log(data);
				angular.copy(data, o.assets);
				console.log(o.assets);
			});
		};

		o.updateRecord = function(data) {
			return $http.post('/updateRecord', data, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				// console.log(data);
			});
		}

		o.addRecord = function(data) {
			console.log(data);
			return $http.post('/addRecord', data, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				o.records.unshift(data);
				// console.log(data);
			});
		}

		o.deleteRecord = function(data) {
			return $http.post('/deleteRecord', data, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				console.log(data._id);
				var index = -1;
				for(var i=0;i<o.records.length;i++) {
					if(o.records[i]._id === data._id) {
						index = i;
						break;
					}
				}
				o.records.splice(index, 1);
			});
		}

		o.registerAsset = function(data) {
			console.log(data);
			return $http.post('/registerAsset', data, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				console.log(data);
				if(data === 'Asset already exists!') {
				} else {
					o.assets.unshift(data);
				}
			});
		}

		o.getAssetInfo = function(data) {
			return $http.post('/getAssetInfo', data, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				console.log(data);
			});
		}

		o.updateAsset = function(data) {
			console.log(data);
			// var updateAssetName;

			return $http.post('/updateAsset', data, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data2){
				// console.log(data);
				if(data2 === 'Asset already exists!') {
				} else {
					updateAssetName = true;
					var oldName;
					var newName;
					for(var i=0;i<o.assets.length;i++) {
						if(o.assets[i]._id === data._id) {
							oldName = o.assets[i].assetName;
							newName = data.assetName;
							o.assets[i].assetName = data.assetName;
							o.assets[i].assetId = data.assetId;
							o.assets[i].assetPoc = data.assetPoc;
							o.assets[i].assetSoc = data.assetSoc;
							o.assets[i].assetStatus = data.assetStatus;
							break;
						}
					}

					$http.post('/updateRecordName?oldName='+oldName+'&newName='+newName).success(function(data){
						console.log(data)
					});
				}
			});
		}

		o.deleteAsset = function(assetName) {
			return $http.post('/deleteAsset?assetName='+assetName).success(function(assetName){
				var index = -1;
				for(var i=0;i<o.assets.length;i++) {
					if(o.assets[i].assetName === assetName) {
						index = i;
						break;
					}
				}
				o.assets.splice(index, 1);
			});
		}

		o.deleteAssetRecord = function(rowId) {
			return $http.post('/deleteAssetRecord?rowId='+rowId).success(function(rowId){
				var index = -1;
				for(var i=0;i<o.records.length;i++) {
					if(o.records[i]._id === rowId) {
						index = i;
						break;
					}
				}
				o.records.splice(index, 1);
			});
		}

		o.getUsers = function(data) {
			return $http.get('/getUsers', {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				console.log(data);
			});
		}

		o.updateUsers = function(userNameToAdd, row) {
			var userNameToAdd = userNameToAdd.users;
			var rowId = row._id;
			return $http.post('/updateUsers?userNameToAdd='+userNameToAdd+"&rowId="+rowId, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				console.log(data);
			});
		}

		return o;
	}
]);
