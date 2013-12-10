define(function ()
{
	'use strict';

	return {

		name: 'Aura collect spread',

		/**
		 *
		 * @param {type} app
		 * @returns {undefined}
		 */
		initialize: function (app)
		{
			/**
			 *
			 */
			app.components.before('initialize', function(options)
			{
				/**
				 * a hash of data providers (functions), that belongs to "this"
				 * and can be invoked during the spread process.
				 */
				this.collectProviders = {};

				/**
				 * adds an entry to the data providers hash
				 *
				 * @param {string} event
				 * @param {function} provider
				 * @returns {undefined}
				 */
				this.registerCollectProvider = function(event, provider)
				{
					if(typeof event === 'undefined' || event.indexOf(' ') >= 0)
						throw new Error("event must be a valid string, like a dictionary key");

					if(typeof provider !== 'function')
						throw new Error("provider needs to be a function");

					this.collectProviders[event] = provider;
				};

				/**
				 * removes an entry from the data providers hash.
				 *
				 * @param {string} event
				 * @returns {undefined}
				 */
				this.unregisterCollectProvider = function(event)
				{
					if(typeof event === 'undefined' || event.indexOf(' ') >= 0)
						throw new Error("event must be a valid string, like a dictionary key");

					if(!_.has(this.collectProviders, event))
						throw new Error("there is no such event in the providers list");

					this.collectProviders[event] = undefined;
					delete this.collectProviders[event];
				};

				/**
				 * the collect event callback.
				 * it redirects the workflow to the spread process.
				 *
				 * @param {Object} collectMetadata
				 * @returns {undefined}
				 */
				this.onCollectRequest = function(collectMetadata)
				{
					this.sandbox.spread(collectMetadata, this);
				};

				/**
				 * every component is listening on collect
				 */
				this.sandbox.on("collect." + this.options.name, this.onCollectRequest, this);
			});

			/**
			 *
			 *
			 * @param {string} event
			 * @param {function} callback
			 * @param {string} component
			 * @param {Object | string | Array | boolean} data
			 * @param {Object} context
			 * @returns {undefined}
			 */
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

					if(callback)
						callback.apply(context, [data]);
				};

				context.sandbox.on(spreadEvent, onSpread, context);

				collectEvent += "collect.";
				collectEvent += component;

				var collectMetadata = {event: event, sentData: data};
				context.sandbox.emit(collectEvent, collectMetadata);
			};

			/**
			 * 
			 *
			 * @param {Object} metadata
			 * @param {Object} context
			 * @returns {undefined}
			 */
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
