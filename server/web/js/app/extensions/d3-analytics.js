define(function ()
{
	'use strict';

	return {

		name: 'D3 Analytics',

		require: {
			paths:  {
				constants								: 'scripts/constants',
				jquery_iframe_transport	: 'bower_components/jquery-iframe-transport/jquery.iframe-transport',
				gridster								: 'bower_components/gridster.js/dist/jquery.gridster.min',
				d3											: 'bower_components/d3/d3',
				dropdown								: 'scripts/dropdown',
				tab											: 'bower_components/twitter-bootstrap/js/tab',
				colorpicker							: 'bower_components/mjaalnir-bootstrap-colorpicker/js/bootstrap-colorpicker',
				color										: "scripts/color",

				//common models
				ModelVisualization			: 'scripts/common/models/visualization',
				ModelDatasource					: 'scripts/common/models/datasource'
			},
			shim: {d3: {exports: 'd3'}}
		},

		/**
		 *
		 * @param {type} app
		 * @returns {undefined}
		 */
		initialize: function (app)
		{
			_.mixin({
				capitalize: function(string) {
					return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
				}
			});

			app.logger.log('Initializing extension: d3-analytics');

			var headerHeight = 60;
			var footerHeight = 30;
			var documentHeight = $(document).height();

			$("#middle-container").css("height", documentHeight - headerHeight - footerHeight);



			/**
			 *
			 */
			app.sandbox.visualizationSizes = {
				1: [1, 1],
				2: [2, 2],
				3: [4, 2],
				4: [6, 2]
			};

			/**
			 *
			 */
			app.sandbox.visualizationTypes = {
				1: "bar.vertical",
				2: "bar.horizontal",
				3: "pie",
				4: "donut",
				5: "line"
			};

			/**
			 *
			 */
			app.sandbox.visualizationTypeNames = {
				1: "Vertical Bar",
				2: "Horizontal Bar",
				3: "Pie",
				4: "Donut",
				5: "Line"
			};

			/**
			 *
			 */
			app.sandbox.chartIcons = {
				"bar.vertical" : '&#128202',
				"bar.horizontal" : '&#128202',
				"pie" : '&#9716',
				"donut" : '&#128191',
				"line": '&#128200'
			};
		}
	};

});
