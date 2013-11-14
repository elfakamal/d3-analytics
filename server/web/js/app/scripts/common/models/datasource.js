define(['backbone'], function(Backbone)
{
	"use strict";

	return Backbone.Model.extend(
	{
		defaults:
		{
			name: ""
		},

		_libraryId: 0,
		_dataStoreId: 3, //temporary

		_attaching: false,

		setLibraryId: function(libraryId)
		{
			this._libraryId = libraryId;
		},

		setDataStoreId: function(dataStoreId)
		{
			this._dataStoreId = dataStoreId;
		},

		/**
		 * I used 'url' instead of 'urlRoot' because I don't want to let
		 * Backbone add the model 'id' at the end of the final url.
		 */
		url: function()
		{
			var url = 'datastores/' + this._dataStoreId + '/datasources';

			if( this.get('dataStoreId') === null || this.get('dataStoreId') === 0 )
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
		}

	});

});
