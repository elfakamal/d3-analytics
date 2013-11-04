define(['backbone'], function(Backbone)
{
	"use strict";

	return Backbone.Model.extend(
	{
		defaults:
		{
			name: '',
			description: "",
			data_store_type_id: 0
		},

		parse: function(response)
		{
			if( response.hasOwnProperty("data_sources") )
			{
				response.datasourceCount = response.data_sources.length;
			}

			return response;
		}

	});

});
