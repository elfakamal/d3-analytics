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

	_syncoo: null,

	initialize: function(app)
	{
		var Backbone = require('backbone');

//		this._syncoo = Backbone.sync;
//		Backbone.sync = this.backboneSync;

//		Backbone.emulateJSON = true;
//		Backbone.emulateHTTP = true;
		app.core.mvc =  Backbone;

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

	},

	backboneSync: function(method, model, options)
	{
		var base = _.isFunction(model['url']) ? model['url']() : model['url'];

		options.url = "http://localhost/d3analyticsRestAPI/api/" + base;

		//Call back the default Backbone.Sync function
		return this._syncoo(method, model, options);
	}

});