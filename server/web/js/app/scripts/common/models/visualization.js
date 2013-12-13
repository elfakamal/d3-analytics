define(['backbone', 'ModelDatasource'],
function(Backbone, ModelDatasource)
{
	"use strict";

	return Backbone.Model.extend(
	{
		defaults:
		{
			name: "",
			description: "",
			visualization_type_id: 0,
			is_starred: false,
			is_active: true,
			chart_data: '{"grouped":false,"negative":false,"size":"1","colors":[]}'
		},

		_libraryId: 0,
		_collectionId: 0,
		_dataSourceId: 0,
		_attaching: false,

		datasource: null,

		save: function()
		{
			console.log("THE MODEL VISUALIZATION IS BEING SAVED : " + JSON.stringify(this.attributes));
			Backbone.Model.prototype.save.apply(this, arguments);
		},


		setLibraryId: function(libraryId)
		{
			this._libraryId = libraryId;
		},

		setCollectionId: function(collectionId)
		{
			this._collectionId = collectionId;
		},

		/**
		 * I used 'url' instead of 'urlRoot' because I don't want to let
		 * Backbone add the model 'id' at the end of the final url.
		 */
		url: function()
		{
			var url = 'collections/' + this._collectionId + '/visualizations';

			if( typeof this._collectionId === 'undefined' ||
					this._collectionId === 0 || this._attaching === true )
			{
				//grab the library id
				url = 'collections/' + this._libraryId + '/visualizations';
			}

			if( typeof this.get('id') !== 'undefined' )
			{
				url += '/' + this.get('id');

				if( this._attaching === true )
				{
					if( this.get('dataSourceId') !== null && this.get('dataSourceId') !== 0 )
					{
						url += "/datasources/" + this._dataSourceId + "/attach";
					}
				}
			}

			return url;
		},

		/**
		 *
		 *
		 */
		attachDataSource: function(dataSourceId, onSuccess, onError, context)
		{
			var self = this;
			this._attaching = true;
			this._dataSourceId = dataSourceId;

			this.save(null, {
				patch: true,
				success: function(model, response)
				{
					onSuccess.apply(context, [model, response]);
					self._attaching = false;
					self._dataSourceId = false;
				},
				error: function(model, response)
				{
					onError.apply(context, [model, response]);
					self._attaching = false;
					self._dataSourceId = false;
				}
			});
		},

		/**
		 *
		 */
		loadDatasource: function(callback, context)
		{
			var dsList = this.get('data_sources');

			if( dsList.length > 0 )
			{
				var rawDatasource = dsList[0];
				this.datasource = new ModelDatasource(rawDatasource);
				this.datasource.load(callback, context);
			}
		},

		/**
		 *
		 */
		getDatasource: function()
		{
			return this.datasource;
		}

	});

});