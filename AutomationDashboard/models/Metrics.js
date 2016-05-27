var mongoose = require('mongoose');

var MetricsSchema = new mongoose.Schema({
	project: String,
	releaseName: String,
	type: String,
	startDate: Date,
	endDate: Date,
	newTestsAutomated: {type: Number, default: null},
	manualExecutionTimeNewTests: {type: Number, default: null},
	automatedExecutionTimeNewTests: {type: Number, default: null},
	cycleTimeSavingsNewTests: {type: Number, default: null},
	maintainedTests: {type: Number, default: null},
	manualExecutionTimeMaintainedTests: {type: Number, default: null},
	automatedExecutionTimeMaintainedTests: {type: Number, default: null},
	cycleTimeSavingsMaintainedTests: {type: Number, default: null},
	executedTests: {type: Number, default: null},
	manualExecutionTimeExecutedTests: {type: Number, default: null},
	automatedExecutionTimeExecutedTests: {type: Number, default: null},
	cycleTimeSavingsExecutedTests: {type: Number, default: null},
	comment: String,
	users: [String],
});

mongoose.model('Metrics', MetricsSchema);