define(['backbone', "../models/datastore"], function(Backbone, DatastoreModel)
{
	"use strict";

	return Backbone.Collection.extend(
	{
		// Reference to this collection's model.
		model	: DatastoreModel,
		url		: 'datastores'
	});

});
