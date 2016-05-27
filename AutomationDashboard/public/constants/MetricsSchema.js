angular.module('automationDashboard').constant('MetricsSchema', {
	type: 'object',
	properties: {
		project: {
			type: 'string', 
			title: 'Project',
		},
		releaseName: {type: 'string', title: 'Release Name'},
		startDate: {type: 'string', format: 'date', title: 'Reporting Start Date'},
		endDate: {type: 'string', format: 'date', title: 'Reporting End Date'},
		newTestsAutomated: {type: 'number', title: 'New Tests Automated'},
		manualExecutionTimeNewTests: {type: 'number', title: 'Manual Execution Time (New Tests)'},
		automatedExecutionTimeNewTests: {type: 'number', title: 'Automated Execution Time (New Tests)'},
		// cycleTimeSavingsNewTests: {type: 'number', title: 'Cycle Time Savings (New Tests)'},
		maintainedTests: {type: 'number', title: 'Maintained Tests'},
		manualExecutionTimeMaintainedTests: {type: 'number', title: 'Manual Execution Time (Maintained Tests)'},
		automatedExecutionTimeMaintainedTests: {type: 'number', title: 'Automated Execution Time (Maintained Tests)'},
		// cycleTimeSavingsMaintainedTests: {type: 'number', title: 'Cycle Time Savings (Maintained Tests)'},
		executedTests: {type: 'number', title: 'Executed Tests'},
		manualExecutionTimeExecutedTests: {type: 'number', title: 'Manual Execution Time (Executed Tests)'},
		automatedExecutionTimeExecutedTests: {type: 'number', title: 'Automated Execution Time (Executed Tests)'},
		// cycleTimeSavingsExecutedTests: {type: 'number', title: 'Cycle Time Savings (Executed Tests)'},
		type: {
			title: 'Type',
			type: 'string',
			enum: ['SIT', 'UAT', 'DEV', 'SHAKEOUT'],
			placeholder: '--- Select One ---',
		},
		comment: {type: 'string', title: 'Comment'},
		// save: {
		// 	type: 'submit',
		// 	title: 'Save'
		// },
		// cancel : { 
		// 	type: 'button', 
		// 	title: 'Cancel', 
		// 	onClick: "cancel()"
		// },
		


		// assetName: {type:'string', title: 'Asset'},
		// assetId: {type:'number', title:'Asset Id'},
		// assetPoc: {type: 'string', title: 'Poc'},
		// assetStatus: {
  //           title: "Asset Status",
  //           type: "string",
  //           enum: ["Complete", "In-Progress", "Failed"],
  //       },
		// releases: {type: 'string', title: 'Release'}
	},
	required: [
		'project',
		'releaseName',
		// 'startDate',
		// 'endDate',
		// 'newTestsAutomated',
		// 'manualExecutionTimeNewTests',
		// 'automatedExecutionTimeNewTests',
		// 'maintainedTests',
		// 'manualExecutionTimeMaintainedTests',
		// 'automatedExecutionTimeMaintainedTests',
		// 'executedTests',
		// 'manualExecutionTimeExecutedTests',
		// 'automatedExecutionTimeExecutedTests',
	]
});