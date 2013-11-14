define(['backbone'], function(Backbone)
{
	"use strict";

	return Backbone.Model.extend(
	{
		urlRoot		: 'http://localhost/d3analyticsRestAPI/index_dev.php/api/collections?XDEBUG_SESSION_START=netbeans-xdebug',

		defaults:
		{
			name: "",
			description: ""
		},

		save: function(key, value, options)
		{
			options = options || {};
			options.success	= this.saveSuccess;
			options.error	= this.saveError;
			return Backbone.Model.prototype.save.call(this, key, value, options);
		},

		saveSuccess: function(model, response)
		{
			//manually fire a "change" event for this model,
			//in order to cause all objects observing the model to update.
			//this.change();
		},

		saveError: function(model, response)
		{
			//model.trigger('save-error');
		}

	});

});
