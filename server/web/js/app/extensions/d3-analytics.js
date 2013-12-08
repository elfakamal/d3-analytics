define(function ()
{
	'use strict';

	return {

		name: 'D3 Analytics',

		require: {
			paths:  {
				jquery_iframe_transport	: 'bower_components/jquery-iframe-transport/jquery.iframe-transport',
				gridster								: 'bower_components/gridster.js/dist/jquery.gridster.min',
				d3											: 'bower_components/d3/d3',
				dropdown								: 'scripts/dropdown',
				tab											: 'bower_components/twitter-bootstrap/js/tab',
				colorpicker							: 'bower_components/mjaalnir-bootstrap-colorpicker/js/bootstrap-colorpicker',

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
			app.sandbox.chartIcons = {
				"bar.vertical" : '&#128202',
				"bar.horizontal" : '&#128202',
				"pie" : '&#9716',
				"donut" : '&#128191',
				"line": '&#128200'
			};


			/**
			 *
			 */
			app.components.before('initialize', function(options)
			{
				this.collectProviders = {};

				this.registerCollectProvider = function(event, provider)
				{
					if(typeof event === 'undefined' || event.indexOf(' ') >= 0)
						throw new Error("event must be a valid string, like a dictionary key");

					if(typeof provider !== 'function')
						throw new Error("provider needs to be a function");

					this.collectProviders[event] = provider;
				};

				this.unregisterCollectProvider = function(event)
				{
					if(typeof event === 'undefined' || event.indexOf(' ') >= 0)
						throw new Error("event must be a valid string, like a dictionary key");

					if(!_.has(this.collectProviders, event))
						throw new Error("there is no such event in the providers list");

					delete this.collectProviders[event];
				};

				this.onCollectRequest = function(collectMetadata)
				{
					this.sandbox.spread(collectMetadata, this);
				};

				this.sandbox.on("collect." + this.options.name, this.onCollectRequest, this);
			});

			app.sandbox.collect = function(event, callback, component, data, context)
			{
				var baseEvent = "spread";
				var spreadEvent = "";
				var collectEvent = "";

				spreadEvent += baseEvent + ".";
				spreadEvent += component;

				var onSpread = function(data)
				{
					context.sandbox.off(spreadEvent, onSpread);
					callback.apply(context, [data]);
				};

				context.sandbox.on(spreadEvent, onSpread, context);

				collectEvent += "collect.";
				collectEvent += component;

				var collectMetadata = {event: event, sentData: data};
				context.sandbox.emit(collectEvent, collectMetadata);
			};

			app.sandbox.spread = function(metadata, context)
			{
				if(!_.has(metadata, "event") || !_.has(metadata, "sentData"))
					throw new Error("spread's metadata is missing");

				if(!_.has(context.collectProviders, metadata.event))
					throw new Error("there is no such event in the providers list");

				var provider = context.collectProviders[metadata.event];
				var result = provider.apply(context, [metadata.sentData]);
				context.sandbox.emit("spread." + context.options.name, result);
			};
		}
	};

});
