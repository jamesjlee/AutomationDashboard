var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var mongoose = require('mongoose');
var Metrics = mongoose.model('Metrics');
var Asset = mongoose.model('Asset');
var User = mongoose.model('User');
var passport = require('passport');
var config = require('./../bin/config');
var auth = jwt({secret: config.secret, userProperty: 'payload'});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/records', function(req, res) {
	Metrics.find({}).exec(function(err, metrics){
		if(err) {console.log(err);}
		res.json(metrics);
	});
});

router.get('/userHasPermission', function(req, res) {
	var user = req.query.user;
	var rowId = req.query.rowId;
	console.log(rowId);
	var query = Metrics.find({_id: rowId});
	query.exec(function(err, metrics) {
		if(err) {console.log(err);}
		console.log(metrics);
		if(metrics.length > 0) {
			if(metrics[0].users.length > 0) {
				if(metrics[0].users.indexOf(user) > -1) {
					res.send(true);
				} else {
					res.send(false);
				}	
			} else {
				res.send(false);				
			}
		} else {
			res.send(false);
		}
	});
});

router.post('/addRecord', auth, function(req, res) {
	console.log(req.body.users);
	var metricsJSON = {
		project: req.body.project,
		releaseName: req.body.releaseName,
		type: req.body.type,
		startDate: req.body.startDate,
		endDate: req.body.endDate,
		newTestsAutomated: req.body.newTestsAutomated,
		manualExecutionTimeNewTests: req.body.manualExecutionTimeNewTests,
		automatedExecutionTimeNewTests: req.body.automatedExecutionTimeNewTests,
		cycleTimeSavingsNewTests: req.body.cycleTimeSavingsNewTests,
		maintainedTests: req.body.maintainedTests,
		manualExecutionTimeMaintainedTests: req.body.manualExecutionTimeMaintainedTests,
		automatedExecutionTimeMaintainedTests: req.body.automatedExecutionTimeMaintainedTests,
		cycleTimeSavingsMaintainedTests: req.body.cycleTimeSavingsMaintainedTests,
		executedTests: req.body.executedTests,
		manualExecutionTimeExecutedTests: req.body.manualExecutionTimeExecutedTests,
		automatedExecutionTimeExecutedTests: req.body.automatedExecutionTimeExecutedTests,
		cycleTimeSavingsExecutedTests: req.body.cycleTimeSavingsExecutedTests,
		comment: req.body.comment,
		users: req.body.users,
	}

	var metrics = new Metrics(metricsJSON);
	metrics.save(function(err, metrics){
		// console.log(metrics);
		res.json(metrics);
		console.log('Metrics saved!');
	});
});

router.post('/updateRecord', auth, function(req, res) {
	Metrics.update({'_id': req.body._id}, {$set: {
		'project': req.body.project, 
		'releaseName': req.body.releaseName,
		'type': req.body.type,
		'startDate': req.body.startDate, 
		'endDate': req.body.endDate, 
		'newTestsAutomated': req.body.newTestsAutomated,
		'manualExecutionTimeNewTests': req.body.manualExecutionTimeNewTests,
		'automatedExecutionTimeNewTests': req.body.automatedExecutionTimeNewTests,
		'cycleTimeSavingsNewTests': req.body.cycleTimeSavingsNewTests,
		'maintainedTests': req.body.maintainedTests,
		'manualExecutionTimeMaintainedTests': req.body.manualExecutionTimeMaintainedTests,
		'automatedExecutionTimeMaintainedTests': req.body.automatedExecutionTimeMaintainedTests,
		'cycleTimeSavingsMaintainedTests': req.body.cycleTimeSavingsMaintainedTests,
		'executedTests': req.body.executedTests,
		'manualExecutionTimeExecutedTests': req.body.manualExecutionTimeExecutedTests,
		'automatedExecutionTimeExecutedTests': req.body.automatedExecutionTimeExecutedTests,
		'cycleTimeSavingsExecutedTests': req.body.cycleTimeSavingsExecutedTests,
		'comment': req.body.comment,
	}}, function(err, metrics){
		if(err){console.log(err);}
		console.log(metrics);
		res.json(metrics);
	});
});

router.post('/deleteRecord', auth, function(req, res) {
	// console.log(req.body);
	Metrics.find({'_id': req.body._id}).remove().exec(function(err, data){
		if(err){console.log(err);}
		// res.json(data);
		console.log('Metrics deleted!');
	});
	res.json(req.body);
});


router.get('/assets', function(req, res) {
	Asset.find({}).exec(function(err, assets){
		if(err) {console.log(err);}
		res.json(assets);
	});
});

router.post('/registerAsset', auth, function(req, res) {
	console.log(req.body);
	var assetJSON = {
		assetId: req.body.assetId,
		assetName: req.body.assetName.toLowerCase(),
		assetPoc: req.body.assetPoc,
		assetSoc: req.body.assetSoc,
		assetStatus: req.body.assetStatus,
	}
	var asset = new Asset(assetJSON);
	var query = Asset.find({'assetName': req.body.assetName.toLowerCase()});
	query.exec(function(err, returnedAsset) {
		if(err){console.log(err);}
		if(returnedAsset.length === 0) {
			asset.save(function(err, asset){
				res.send(req.body);
				console.log('Asset saved!');
			});
		} else {
			res.send('Asset already exists!');
		}
	});
});

router.post('/getAssetInfo', function(req, res) {
	console.log(req.body.project);
	var query = Asset.find({'assetName': req.body.project});
	query.exec(function(err, returnedAsset) {
		if(err){console.log(err);}
		if(returnedAsset.length === 0) {
			res.send('Asset not found!');

		} else {
			res.send(returnedAsset);
		}
	});
});

router.post('/updateAsset', auth, function(req, res) {
	var query = Asset.find({'assetName': req.body.assetName.toLowerCase()});
	query.exec(function(err, returnedAsset) {
		if(err){console.log(err);}
		if(returnedAsset.length !== 0) {
			Asset.update({'_id': req.body._id}, {$set: {
				assetId: req.body.assetId,
				assetPoc: req.body.assetPoc,
				assetSoc: req.body.assetSoc,
				assetStatus: req.body.assetStatus,
			}}, function(err, asset){
				if(err){console.log(err);}
				res.json(asset);
			});
		}
	});
});

router.post('/deleteAsset', function(req, res) {
	Asset.find({'assetName': req.query.assetName}).remove().exec();
	res.send(req.query.assetName);
});

router.post('/deleteAssetRecord', function(req, res) {
	Metrics.find({'_id': req.query.rowId}).remove().exec();
	res.send(req.query.rowId);
});

router.post('/updateRecordName', function(req, res) {
	var oldName = req.query.oldName;
	var newName = req.query.newName;
	// console.log(req.query.oldName);
	Metrics.update({'project': oldName}, {$set: {
		'project': newName, 
	}}, {multi: true}, function(err, metrics){
		if(err){console.log(err);}
		res.json(metrics);
	});
});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields.'});
  }

  var query = User.find({username: req.body.username});
  query.exec(function(err, returnedUser) {
  	if(returnedUser.length === 0) {
	  var user = new User();

	  user.username = req.body.username;

	  user.setPassword(req.body.password);

	  user.save(function (err){
	    if(err){ return next(err); }

	    return res.json({token: user.generateJWT()})
	  });
  	} else {
  		return res.status(400).json({message: 'Username taken, please choose another.'})
  	}
  });


});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields.'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.get('/getUserNames', function(req, res){
	User.find({}).exec(function(err, users){
		if(err) {console.log(err);}
		res.json(users);
	});
});

router.post('/updateUsers', function(req, res){
	console.log(req.query.userNameToAdd);

	var query = Metrics.find({'users': req.query.userNameToAdd});
	query.exec(function(err, returnedUser) {
		if(returnedUser.length > 0) {
			// do nothing
			console.log('here');
		} else {
			console.log(req.query.userNameToAdd);
			console.log('in here');
			Metrics.update({_id: req.query.rowId },
	         {$push: { 'users' : req.query.userNameToAdd }},{upsert:true}, function(err, data) { 
		    	if(err){console.log(err);}
		    	res.json(data);	   
			});
		}
	});


	// var query = Metrics.find({'_id': rowId});
	// query.exec(function(err, returnedRecord){
	// 	if(err) {console.log(err);}
	// 	if(returnedRecord.length > 0) {
	// 		Metrics.update({'_id'})
	// 	}
	// });
});

module.exports = router;