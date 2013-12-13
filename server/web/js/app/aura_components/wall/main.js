define([
	"./collections/visualizations",
	"text!./templates/base.html",
	"text!./templates/visualization.html",
	"gridster",
	"constants"
],
function(VisualizationCollection, rawBaseTemplate, rawVisualizationTemplate, gridster, constants)
{
	"use strict";

	var baseTemplate			= _.template(rawBaseTemplate);
	var visualizationTemplate	= _.template(rawVisualizationTemplate);

	return {

		type: "Backbone",
		childrenVisualizations: [],
		_collectionId: 0,
		_library: null,
		grid: null,

		/**
		 * initializes the most important objects in the component.
		 *
		 * @returns {undefined}
		 */
		initialize: function()
		{
			this.initCollection();
			this.initListeners();
			this.lazyInitLibrary();

			this.registerCollectProvider("collection.id", this.getAwesomeData);
		},

		/**
		 * initializes the collection and listens on it's events.
		 *
		 * @returns {undefined}
		 */
		initCollection: function()
		{
			this.collection = new VisualizationCollection();

			this.collection.bind('add', this.renderOne, this);
			this.collection.bind('remove', this.render, this);
			this.collection.bind('reset', this.render, this);
		},

		getAwesomeData: function(data)
		{
			return this._collectionId;
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initListeners: function()
		{
			this.sandbox.on('collections.selected', this.onCollectionSelected, this);
			this.sandbox.on("visualizations.resize", this.onVisualizationResize, this);
			this.sandbox.on("visualizations.model.get", this.onVisualizationModelRequest, this);
		},

		/**
		 * a collect process that brings the library collection id when it is ready.
		 *
		 * @returns {undefined}
		 */
		lazyInitLibrary: function()
		{
			this.sandbox.on("collections.library.get.response", this.onGetLibraryCollectionResponse, this);

			//don't need to send this demand, the collection component send it
			//just after it's totally loaded.
			//this.sandbox.emit("collections.library.get");
		},

		/**
		 *
		 * @param {type} libraryCollection
		 * @returns {undefined}
		 */
		onGetLibraryCollectionResponse: function(libraryCollection)
		{
			this.sandbox.off("collections.library.get.response", this.onGetLibraryCollectionResponse);
			this._library = libraryCollection;
		},

		/**
		 *
		 * @param {type} d3collectionModel
		 * @returns {undefined}
		 */
		onCollectionSelected: function(d3collectionModel)
		{
			if(this._collectionId !== d3collectionModel.get('id'))
			{
				this.collection.setCollectionId(d3collectionModel.get('id'));
				this._collectionId = d3collectionModel.get('id');
			}
		},

		/**
		 *
		 * @param {type} resizeData
		 * @returns {undefined}
		 */
		onVisualizationResize: function(resizeData)
		{
			if( typeof resizeData !== "undefined" )
			{
				this.grid.resize_widget(
					resizeData.el,
					resizeData.sizeX,
					resizeData.sizeY,
					resizeData.reposition,
					resizeData.callback);
			}
		},

		/**
		 *
		 * @param {type} visualizationId
		 * @returns {undefined}
		 */
		onVisualizationModelRequest: function(visualizationId)
		{
			var result = this.collection.filter(function(modelVisualization)
			{
				return modelVisualization.get('id') === visualizationId;
			});

			if( result.length !== 1 )
			{
				this.sandbox.emit('visualizations.model.get.response', {error: "there is no such visualization"});
				return;
			}

			var modelVisualization = result[0];
			modelVisualization.setCollectionId(this.collection.getCollectionId());
			modelVisualization.setLibraryId(this._library.get('id'));
			this.sandbox.emit('visualizations.model.get.response', {model: modelVisualization});
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initGrid: function()
		{
			this.grid = $(".gridster > ul").gridster({
				widget_margins: [constants.DEFAULT_HORIZONTAL_MARGIN, constants.DEFAULT_VERTICAL_MARGIN],
				widget_base_dimensions: [constants.DEFAULT_THUMB_WIDTH, constants.DEFAULT_THUMB_HEIGHT],
				draggable:{
					handle: 'div#div-handle #span-visualization-name'
				}
			}).data("gridster");
		},

		/**
		 * deprecated
		 *
		 * This is useless because the this.html(baseTemplate()) implicitly stops
		 * children components.
		 *
		 * @returns {undefined}
		 */
		stopChildren: function()
		{
			_.each(this.childrenVisualizations, function(selector)
			{
				if( this.$find(selector).length > 0 )
				{
					this.sandbox.stop(selector);
				}
			}, this);
		},

		/**
		 *
		 * @param {type} modelVisualization
		 * @returns {undefined}
		 */
		renderOne: function(modelVisualization)
		{
			var data = {
				id: modelVisualization.get('id'),
				d3collectionId: this.collection.getCollectionId()
			};

			var rawChartData, chartData, vizSizeIndex, vizSize = [1, 1];
			rawChartData = modelVisualization.get("chart_data");

			if(rawChartData !== "")
			{
				chartData = JSON.parse(rawChartData);
				vizSizeIndex = chartData.size;
				vizSize = this.sandbox.visualizationSizes[vizSizeIndex];
			}

			var newVisualizationHTML = visualizationTemplate(_.extend(data, modelVisualization.toJSON()));
			var gridsterWidget = this.grid.add_widget.apply(this.grid, [newVisualizationHTML].concat(vizSize));
			var newVisualizationElementID = $(gridsterWidget).attr("id");

			if(this.childrenVisualizations.indexOf("#" + newVisualizationElementID) < 0)
				this.childrenVisualizations.push("#" + newVisualizationElementID);
		},

		/**
		 *
		 * @returns {undefined}
		 */
		render: function()
		{
			//this is useless because the this.html(baseTemplate()) implicitly stops
			//children components.
			//this.stopChildren();

			this.html(baseTemplate());
			this.initGrid();

			this.collection.each(function(modelVisualization)
			{
				this.renderOne(modelVisualization);
			}, this);
		}

	}

});