define(['backbone'], function(Backbone)
{
	"use strict";

	return Backbone.Model.extend(
	{
		urlRoot: 'datastores',

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
			alert('save success');
		},

		saveError: function(model, response)
		{
			alert('save error');
		}

	});

});
