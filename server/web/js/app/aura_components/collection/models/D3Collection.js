define(['backbone'], function(Backbone)
{
	"use strict";

	var D3CollectionModel = Backbone.Model.extend(
	{
		defaults:
		{
			name: '',
			description: "",
			collection_type_id: 0
		},

		parse: function(response)
		{
			if( response.hasOwnProperty("visualizations") )
			{
				response.visualizationCount = response.visualizations.length;
			}

			return response;
		}

	});

	return D3CollectionModel;

});
