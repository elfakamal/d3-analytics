define(['backbone', 'd3'], function(Backbone, d3)
{
	"use strict";

	return Backbone.Model.extend(
	{

		/**
		 * example:
		 *
		 *{
		 *	id: 28
		 *	name: "my data"
		 *	file_name: "7b4b97e9913eb5f7c86c8a664c77a67d.d3a"
		 *	file_extension: "tsv"
		 *}
		 *
		 */
		defaults:
		{
			name: ""
		},

		_libraryId: 0,

		/**
		 * TODO: implement a way to set this property.
		 */
		_dataStoreId: 3, //temporary

		_attaching: false,

		allowedFileTypes : [
			"text",
			"json",
			"html",
			"xml",
			"csv",
			"tsv"
		],

		datasourceContent: null,
		datasourceColumns: null,

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

			if( this._attaching === true )
			{
				if( this.get('dataSourceId') !== null && this.get('dataSourceId') !== 0 )
				{
					url += "/" + this.get('id') + "/datasources/" + this._dataSourceId + "/attach";
				}
			}

			return url;
		},

		/**
		 *
		 * @param {string} fileType
		 * @returns {Boolean}
		 */
		isFileTypeAllowed : function(fileType)
		{
			if( typeof fileType === 'undefined' )
			{
				return false;
			}

			return this.allowedFileTypes.indexOf(fileType) >= 0;
		},

		/**
		 *
		 * @param {function} callback
		 * @param {Object} context
		 * @returns {undefined}
		 */
		load: function(callback, context)
		{
			if( !this.isFileTypeAllowed(this.get("file_extension")) )
			{
				throw new Error("D3 Analytics: File not supported");
				return;
			}

			var path = "uploads/datasources/" + this.get("file_name");
			var d3loader = d3[this.get("file_extension")];

			var deferred = d3loader.apply(d3, [path]);

			deferred.get(this.onD3LoaderComplete(callback, context));
		},

		/**
		 *
		 * @param {function} callback
		 * @param {Object} context
		 * @returns {unresolved}
		 */
		onD3LoaderComplete: function(callback, context)
		{
			var self = this;

			return function(error, data)
			{
				if(error)
				{
					throw new Error(error);
				}

				self.datasourceContent = data;
				self.updateColumns();

				var cntxt = context ? context : null;

				if(callback)
				{
					callback.call(cntxt, data);
				}
			};
		},

		/**
		 *
		 * @returns {undefined}
		 */
		updateColumns: function()
		{
			if( this.datasourceContent &&
					_.isArray(this.datasourceContent) &&
					this.datasourceContent.length > 0 )
			{
				var columns = _.keys(this.datasourceContent[0]);
				var keys = _.range(columns.length);
				this.datasourceColumns = _.object(keys, columns);
			}
		},

		/**
		 *
		 * @returns {Object}
		 */
		getContent: function()
		{
			return this.datasourceContent;
		},

		/**
		 *
		 * @returns {Object}
		 */
		getColumns: function()
		{
			return this.datasourceColumns;
		}
	});

});
