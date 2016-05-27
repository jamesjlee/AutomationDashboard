var mongoose = require('mongoose');

var AssetSchema = new mongoose.Schema({
	assetId: Number,
	assetName: {type: String, lowercase: true, unique: true},
	assetPoc: String,
	assetSoc: String,
	assetStatus: String,
});

mongoose.model('Asset', AssetSchema);