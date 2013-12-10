(function() {

	var historyStarted = false;

	define({

		name: "Aura Backbone",

		require:
		{
			paths: {backbone: 'bower_components/backbone/backbone'},
			shim: {backbone: {exports: 'Backbone', deps: ['underscore', 'jquery']}}
		},

		initialize: function(app)
		{
			var Backbone = require('backbone');

			var mySync = Backbone.sync;

			Backbone.sync = function(method, model, options)
			{
				var base = _.isFunction(model['url']) ? model['url']() : model['url'];

				if (base === "")
				{
					base = _.isFunction(model['urlRoot']) ? model['urlRoot']() : model['urlRoot'];
				}

				if (base.indexOf("?") >= 0)
				{
					base += '&XDEBUG_SESSION_START=netbeans-xdebug';
				}
				else
				{
					base += '?XDEBUG_SESSION_START=netbeans-xdebug';
				}

				options.url = "http://localhost/d3analyticsRestAPI/index_dev.php/api/" + base;

				//Call back the default Backbone.Sync function
				return mySync(method, model, options);
			};

			app.core.mvc = Backbone;

			//for later
			app.components.addType("Backbone", function()
			{
				return Backbone.View;
			});

			var Views = {};

			// Injecting a Backbone view in the Component just before initialization.
			// This View's class will be built and cached this first time the component is included.
			app.components.before('initialize', function(options)
			{
				var View = Views[options.ref];

				var extendedProperties = [
					'model',
					'collection',
					'id',
					'attributes',
					'className',
					'tagName',
					'events',
					'el'
				];

				if( "events" in this )
				{
					_.each(this.events, function(value, key, list)
					{
						if( typeof value === 'string' )
						{
							extendedProperties.push(value);
							//this.events[key] = this.component[value];
						}
					}, this);
				}

				if (!View)
				{
					var wantedPropertiesThis = _.pick(this, extendedProperties);
					//var nonNativeThis = _.omit(this, nativeProperties);

					//I am using _.defaults instead of _.extend in order
					//to avoid modifying native properties & functions.
					//var self = _.defaults(wantedPropertiesThis, nonNativeThis);

					Views[options.ref] = View = Backbone.View.extend(wantedPropertiesThis);
				}

				this.view = new View({el: this.$el});
				this.view.sandbox = this.sandbox;
				this.view.component = this;
			});

			app.components.before('remove', function()
			{
				var stopData;
				if(_.has(this.options, "stopData"))
					stopData = this.options.stopData;

				var event = "component.stop." + this.options.name;
				this.sandbox.emit(event, stopData);

				this.view && this.view.stopListening();
			});

		}
	})
})();
