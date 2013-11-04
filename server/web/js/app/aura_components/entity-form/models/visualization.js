define(['backbone'], function(Backbone)
{
	"use strict";

	return Backbone.Model.extend(
	{
		defaults:
		{
			name: "",
			description: "",
			visualizationTypeId: 0
		},

		_libraryId: 0,
		_collectionId: 0,
		_dataSourceId: 0,
		_attaching: false,

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

			if( this.get('collectionId') === null || this.get('collectionId') === 0 )
			{
				//grab the library id
			}

			if( this._attaching == true )
			{
				if( this.get('dataSourceId') !== null && this.get('dataSourceId') !== 0 )
				{
					url += "/" + this.get('id') + "/datasources/" + this._dataSourceId + "/attach";
				}
			}

			return url;
		},

		attachDataSource: function(dataSourceId, onSuccess, onError)
		{
			var self = this;
			this._attaching = true;
			this._dataSourceId = dataSourceId;

			this.save(null, {
				patch: true,
				success: function(model, response)
				{
					onSuccess(model, response);
					self._attaching = false;
					self._dataSourceId = false;
				},
				error: function(model, response)
				{
					onError(model, response);
					self._attaching = false;
					self._dataSourceId = false;
				}
			});
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
