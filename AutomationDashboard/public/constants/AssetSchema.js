angular.module('automationDashboard').constant('AssetSchema', {
	type: 'object',
	properties: {
		assetName: {type:'string', title: 'Asset'},
		assetId: {type:'number', title:'Id'},
		assetPoc: {type: 'string', title: 'Poc'},
		assetSoc: {type: 'string', title: 'Soc'},
		assetStatus: {
			title: 'Status',
			type: 'string',
			enum: ['INFLIGHT', 'COMPLETE'],
			placeholder: '--- Select One ---',
		},
	},
	required: [
		'assetName',
		'assetId',
		'assetPoc',
		'assetSoc',
		'assetStatus',
	]
});