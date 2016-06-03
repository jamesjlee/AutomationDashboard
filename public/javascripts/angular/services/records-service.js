angular.module('automationDashboard').factory('records', [
	'$http',
	'$state',
	'auth',
	function($http, $state, auth) {
		var o = {
			records: [],
			assets: [],
			users: [],
		};

		o.getRecords = function() {
			return $http.get('/records').success(function(data){
				// console.log(data);
				angular.copy(data, o.records);
				console.log(o.records);
			});
		};

		o.addRecord = function(data) {
			console.log(data);
			return $http.post('/records', data, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				o.records.unshift(data);
			});
		}

		o.updateRecord = function(data) {
			console.log(data);
			return $http.put('/records/' + data._id, data, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				console.log(data.message);
			});
		}

		o.deleteRecord = function(data) {
			var index = -1;
			for(var i=0;i<o.records.length;i++) {
				if(o.records[i]._id === data._id) {
					index = i;
					break;
				}
			}
			o.records.splice(index, 1);
			return $http.delete('/records/' + data._id, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				console.log(data.message);
			});
		}

		o.getAssets = function() {
			return $http.get('/assets').success(function(data){
				// console.log(data);
				angular.copy(data, o.assets);
				console.log(o.assets);
			});
		};

		o.duplicateRecord = function(data) {
			// console.log(data);
			return $http.post('/records', data, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				o.records.unshift(data);
			});
		}

		o.registerAsset = function(data) {
			console.log(data);
			return $http.post('/assets', data, {
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
			// console.log(data._id);
			var _id;
			for(var i=0; i<o.assets.length;i++) {
				if(o.assets[i].assetName === data.project) {
					console.log(o.assets[i]);
					_id = o.assets[i]._id;
				}
			}
			return $http.get('/assets/' + _id).success(function(data){
				console.log(data);
			});
		}

		o.updateAsset = function(data) {
			console.log(data);
			// var updateAssetName;

			return $http.put('/assets/' + data._id, data, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(res){
				// console.log(data);
				if(res.message === 'Asset already exists!') {
				} else {
					// updateAssetName = true;
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

					$http.put('/updateRecordName?oldName='+oldName+'&newName='+newName, "", {
						headers: {Authorization: 'Bearer '+auth.getToken()}
					}).success(function(data){
						console.log(data)
					});
				}
			});
		}

		o.deleteAsset = function(data) {
			var _id;
			var index = -1;

			for(var i=0; i<o.assets.length;i++) {
				if(o.assets[i].assetName === data.project) {
					_id = o.assets[i]._id;
					index = i;
					break;
				}
			}
			console.log(index);
			o.assets.splice(index, 1);
			return $http.delete('/assets/' + _id, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				console.log(data);
			});
		}

		o.deleteAssetRecord = function(rowId) {
			return $http.post('/deleteAssetRecord?rowId='+rowId, "", {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(rowId){
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
			return $http.get('/users', {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				// console.log(data);
				angular.copy(data, o.users);
				console.log(o.users);
			});
		}

		o.updateUsers = function(userNameToAdd, row) {
			var userNameToAdd = userNameToAdd.users;
			var rowId = row._id;


			// return $http.put('/records/' + row._id, data, {
			// 	headers: {Authorization: 'Bearer '+auth.getToken()}
			// }).success(function(data){
			// 	console.log(data.message);
			// });

			return $http.put('/updateUsers?userNameToAdd='+userNameToAdd+"&rowId="+rowId, "", {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				console.log(data);
			});
		}

		o.changeAccess = function(user) {
			var user = user;
			user.isAdmin = !user.isAdmin;
			console.log(user);
			return $http.put('/users/' + user._id, user, {
				headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				console.log(data);
			});
		}

		return o;
	}
]);
