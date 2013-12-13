define(['./collections/datasources', "text!./templates/base.html"], function (DatasourceCollection, rawTemplate)
{

	'use strict';

	var template = _.template(rawTemplate);

	return {

		type: "Backbone",

		events: {
			'click #button-datasource-cancel': function()
			{
				this.sandbox.stop();
			},
			'click #button-datasource-ok': function()
			{
				this.component.onOKbuttonClick();
			}
		},

		onOKbuttonClick: function()
		{
			var datasourceId = this.$find("#select-datasource").val();
			this.sendChosenDatasource(+datasourceId);
		},

		sendChosenDatasource: function(datasourceId)
		{
			var result = this.collection.filter(function(datasource)
			{
				return datasource.get("id") === datasourceId;
			});

			if( result && result.length === 1 )
			{
				this.sandbox.emit('datasource.chosen', result[0]);
			}
		},

		initialize: function ()
		{
			this.initCollection();
			this.initListeners();
		},

		initListeners: function ()
		{
			this.getLibrary();
		},

		initCollection: function()
		{
			this.collection = new DatasourceCollection();
		},

		getLibrary: function()
		{
			this.sandbox.on("datastore.library.get.response", this.onGetLibraryDatastoreResponse, this);
			this.sandbox.emit("datastore.library.get");
		},

		onGetLibraryDatastoreResponse: function(libraryDatastore)
		{
			this.sandbox.off("datastore.library.get.response", this.onGetLibraryDatastoreResponse);

			this.collection.setDatastoreId(libraryDatastore.get('id'));
			this.collection.bind('reset', this.render, this);
			this.collection.fetch();
		},

		render: function ()
		{
			this.$el.html(template({
				buttonLegend: this.options.buttonLegend,
				dataSourceList: this.collection
			}));
		}

	};

});
