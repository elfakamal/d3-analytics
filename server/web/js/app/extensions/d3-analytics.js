define(function ()
{
	'use strict';

	return {

		require: {
			paths:  {
				jquery_iframe_transport: 'bower_components/jquery-iframe-transport/jquery.iframe-transport',
				gridster: 'bower_components/gridster.js/dist/jquery.gridster.min',
				d3: 'bower_components/d3/d3',
				dropdown: 'scripts/dropdown',

				//common models
				ModelVisualization: 'scripts/common/models/visualization',
				ModelDatasource: 'scripts/common/models/datasource'
			},
			shim: {d3: {exports: 'd3'}}
		},

		name: 'D3 Analytics',

		initialize: function (application)
		{
			// Your brilliant code here!
			application.logger.log('Initializing extension: d3-analytics');
		}
	};

});
