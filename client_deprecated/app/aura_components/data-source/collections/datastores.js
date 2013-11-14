define(['backbone', "../models/datastore"], function(Backbone, DatastoreModel)
{
	"use strict";

	return Backbone.Collection.extend(
	{
		// Reference to this collection's model.
		model	: DatastoreModel,
		url		: 'http://localhost/d3analyticsRestAPI/index_dev.php/api/datastores'
	});

});
