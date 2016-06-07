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

router.param('record', function(req, res, next, id) {
	console.log(id);
  var query = Metrics.findById(id);

  query.exec(function (err, record){
    if (err) { return next(err); }
    if (!record) { return next(new Error('can\'t find record')); }

    req.record = record;
    return next();
  });
});

router.get('/records', function(req, res) {
	Metrics.find({}).exec(function(err, metrics){
		if(err) {console.log(err);}
		res.json(metrics);
	});
});

router.post('/records', auth, function(req, res) {
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
		// res.json({message: 'Record saved'});
		res.json(metrics);
	});
});

router.get('/records/:record', function(req, res){
	res.json(req.record);
});

router.put('/records/:record', auth, function(req, res){
	Metrics.update({'_id': req.record._id}, {$set: {
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
		'users': req.body.users,
	}}, function(err, metrics){
		if(err){console.log(err);}
		console.log(metrics);
		res.json({message: 'Successfully updated record'});
	});
});

router.delete('/records/:record', auth, function(req, res){
	Metrics.remove({'_id': req.record._id}, function(err, metric){
		if(err){console.log(err);}
		res.json({message: 'Successfully deleted record'})
	});
});

router.param('asset', function(req, res, next, id) {
  var query = Asset.findById(id);

  query.exec(function (err, asset){
  	console.log(asset);
    if (err) { return next(err); }
    if (!asset) { return next(new Error('can\'t find asset')); }
    req.asset = asset;
    return next();
  });
});

router.get('/assets', function(req, res) {
	Asset.find({}).exec(function(err, assets){
		if(err) {console.log(err);}
		res.json(assets);
	});
});

router.post('/assets', auth, function(req, res) {
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
				res.send(asset);
				console.log('Asset saved!');
			});
		} else {
			res.send('Asset already exists!');
		}
	});
});

router.get('/assets/:asset', function(req, res){
	res.json(req.asset);
});

router.put('/assets/:asset', auth, function(req, res){
	if(req.asset.assetName === req.body.assetName) {
		Asset.update({'_id': req.asset._id}, {$set: {
			assetName: req.body.assetName.toLowerCase(),
			assetId: req.body.assetId,
			assetPoc: req.body.assetPoc,
			assetSoc: req.body.assetSoc,
			assetStatus: req.body.assetStatus,
		}}, function(err, asset){
			if(err){console.log(err);}
			res.json(asset);
		});
	} else {
		var query = Asset.find({'assetName': req.body.assetName.toLowerCase()});
		query.exec(function(err, returnedAsset) {
			if(returnedAsset.length === 0) {
				Asset.update({'_id': req.asset._id}, {$set: {
					assetName: req.body.assetName.toLowerCase(),
					assetId: req.body.assetId,
					assetPoc: req.body.assetPoc,
					assetSoc: req.body.assetSoc,
					assetStatus: req.body.assetStatus,
				}}, function(err, asset){
					if(err){console.log(err);}
					res.json(asset);
				});
			} else {
				res.json({message: 'Asset already exists!'})
			}
		});
	}
});

router.delete('/assets/:asset', auth, function(req, res){
	Asset.remove({'_id': req.asset._id}, function(err, asset){
		if(err){console.log(err);}
		res.json({message: 'Successfully deleted asset'})
	});
});



router.put('/updateRecordName', auth, function(req, res) {
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

	  user.isAdmin = false;

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

router.param('user', function(req, res, next, id) {
  var query = User.findById(id);

  query.exec(function (err, user){
  	console.log(user);
    if (err) { return next(err); }
    if (!user) { return next(new Error('can\'t find user')); }
    req.user = user;
    return next();
  });
});

router.get('/users', function(req, res){
	User.find({}).exec(function(err, users){
		if(err) {console.log(err);}
		res.json(users);
	});
});

router.get('/users/:user', function(req, res){
	res.json(req.user);
});

router.put('/users/:user', auth, function(req, res){
	if(req.body.password) {
		var user = new User();
		user.setPassword(req.body.password);
		User.update({'_id': req.user._id}, {$set: {
			username: req.body.username,
			salt: user.salt,
			hash: user.hash,
			isAdmin: req.body.isAdmin,
		}}, function(err, user){
			if(err){console.log(err);}
			res.json(user);
		});
	} else {
		User.update({'_id': req.user._id}, {$set: {
			username: req.body.username,
			salt: req.body.salt,
			hash: req.body.hash,
			isAdmin: req.body.isAdmin,
		}}, function(err, user){
			if(err){console.log(err);}
			res.json(user);
		});
	}
});

router.delete('/users/:user', auth, function(req, res){
	User.remove({'_id': req.user._id}, function(err, user){
		if(err){console.log(err);}
		res.json({message: 'Successfully deleted user'})
	});
});

router.get('/users-findByUsername', function(req, res){
	var user = req.query.username;
	var query = User.find({username: user});
	query.exec(function(err, returnedUser){
		if(returnedUser.length !== 0) {
			res.send(returnedUser);
		}
	});
});


router.put('/updateUsers', function(req, res){
	console.log(req.query.userNameToAdd);

	var query = Metrics.find({'users': req.query.userNameToAdd});
	query.exec(function(err, returnedUser) {
		if(returnedUser.length > 0) {
			// do nothing
		} else {
			console.log(req.query.userNameToAdd);
			Metrics.update({_id: req.query.rowId },
	         {$push: { 'users' : req.query.userNameToAdd }},{upsert:true}, function(err, data) { 
		    	if(err){console.log(err);}
		    	res.json(data);	   
			});
		}
	});
});

router.get('/userHasPermission', function(req, res) {
	var user = req.query.user;
	var rowId = req.query.rowId;
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

module.exports = router;