define({
	require: {
		paths:  {
			backbone:   'bower_components/backbone/backbone',
			underscore: 'bower_components/underscore/underscore'
		},
		shim:   {
			backbone: {
				exports: 'Backbone',
				deps: ['underscore', 'jquery']
			}
		}
	},

	initialize: function(app)
	{
		var Backbone = require('backbone');

		var mySync = Backbone.sync;

		Backbone.sync = function(method, model, options)
		{
			var base = _.isFunction(model['url']) ? model['url']() : model['url'];

			if( base == "" )
			{
				base = _.isFunction(model['urlRoot']) ? model['urlRoot']() : model['urlRoot'];
			}

			if( base.indexOf("?") >= 0 )
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
//		app.core.Components["Backbone"] = Backbone.View;

		var Views = {};

		// Injecting a Backbone view in the Component just before initialization.
		// This View's class will be built and cached this first time the component is included.
		app.components.before('initialize', function(options)
		{
			var View = Views[options.ref];
			if (!View)
			{
				Views[options.ref] = View = Backbone.View.extend(this.View);
			}

			this.view = new View({
				el: this.$el
			});
			this.view.sandbox = this.sandbox;
			this.view.component = this;
		});

		app.components.before('remove', function()
		{
			this.view && this.view.stopListening();
		});

	}

});