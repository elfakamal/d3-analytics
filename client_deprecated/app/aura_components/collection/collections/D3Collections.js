define(['backbone', "../models/D3Collection"], function(Backbone, D3CollectionModel)
{
	"use strict";

	return Backbone.Collection.extend(
	{
		// Reference to this collection's model.
		model	: D3CollectionModel,
		url		: 'http://localhost/d3analyticsRestAPI/index_dev.php/api/collections',

		getSystemCollections: function()
		{
			return this.filter(function(d3collection)
			{
				return d3collection.get('collection_type_id') == 1;
			});
		},

		getRegularCollections: function()
		{
			return this.filter(function(d3collection)
			{
				return d3collection.get('collection_type_id') == 2;
			});
		},



		getLibraryCollection: function()
		{
			return this.filter(function(d3collection)
			{
				return d3collection.get('name') == "Library" && d3collection.get('collection_type_id') == 1;
			});
		},

		getStarredCollection: function()
		{
			return this.filter(function(d3collection)
			{
				return d3collection.get('name') == "Starred" && d3collection.get('collection_type_id') == 1;
			});
		},

		getDeletedCollection: function()
		{
			return this.filter(function(d3collection)
			{
				return d3collection.get('name') == "Deleted" && d3collection.get('collection_type_id') == 1;
			});
		}
	});

});
